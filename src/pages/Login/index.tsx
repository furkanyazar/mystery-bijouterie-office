import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { ValidationEmail, ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";
import { handleChangeInput } from "../../functions";
import auth from "../../http/auth";
import LoginCommand from "../../http/auth/models/commands/loginCommand";
import users from "../../http/users";

export default function index() {
  const navigate = useNavigate();

  const [loginModel, setLoginModel] = useState<LoginCommand>({ ...defaultLoginModel });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    setLoading(true);
    await auth
      .login(loginModel)
      .then(async (response) => {
        setLoading(true);
        await users
          .getUserFromAuth()
          .then((response) => navigate("/"))
          .catch((errorResponse) => {})
          .finally(() => setLoading(false));
      })
      .catch((errorResponse) => {})
      .finally(() => setLoading(false));
  };

  const validationSchema = Yup.object({
    email: Yup.string().required(ValidationRequired).email(ValidationEmail),
    password: Yup.string().required(ValidationRequired).min(4, ValidationMinLength),
  });

  const pageTitle = "Giriş Yap";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Container className="my-5">
        <Row>
          <Col>
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
        </Row>
        <hr className="mb-5" />
        <Row>
          <Col className="col-sm-12 col-md-6 mx-auto">
            <Formik
              enableReinitialize
              onSubmit={handleSubmit}
              initialValues={loginModel}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors }) => (
                <Form>
                  <FormGroup className="mb-3" controlId="loginFormEmail">
                    <FormLabel>E-Posta</FormLabel>
                    <FormControl
                      className={errors.email && "is-invalid"}
                      type="text"
                      placeholder="E-posta adresinizi giriniz"
                      name="email"
                      value={loginModel.email}
                      onChange={(e: any) => handleChangeInput(e, loginModel, setLoginModel)}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="loginFormPassword">
                    <FormLabel>Şifre</FormLabel>
                    <FormControl
                      className={errors.password && "is-invalid"}
                      type="password"
                      placeholder="Şifrenizi giriniz"
                      name="password"
                      value={loginModel.password}
                      onChange={(e: any) => handleChangeInput(e, loginModel, setLoginModel)}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                  </FormGroup>
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Giriş Yap"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const defaultLoginModel: LoginCommand = { email: "", password: "" };
