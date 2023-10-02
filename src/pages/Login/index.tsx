import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik, Form as FormikForm } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { ValidationEmail, ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";
import { handleChangeInput } from "../../functions";
import { cancelToken } from "../../http";
import auth from "../../http/auth";
import LoginCommand from "../../http/auth/models/commands/loginCommand";
import users from "../../http/users";

export default function index() {
  const navigate = useNavigate();

  const [loginModel, setLoginModel] = useState<LoginCommand>({ ...defaultLoginModel });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => cancelToken.cancel();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    await auth
      .login(loginModel)
      .then(async (response) => {
        setLoading(true);
        await users
          .getFromAuth()
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

  return (
    <>
      <Helmet>
        <title>Giriş Yap</title>
      </Helmet>
      <Container className="my-5">
        <Row>
          <Col className="mx-auto col-sm-12 col-md-6">
            <Formik
              enableReinitialize
              onSubmit={handleSubmit}
              initialValues={loginModel}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ errors }) => (
                <FormikForm>
                  <Form.Group className="mb-3" controlId="loginFormEmail">
                    <Form.Label>E-Posta</Form.Label>
                    <Form.Control
                      className={errors.email && "is-invalid"}
                      type="text"
                      placeholder="E-posta adresinizi giriniz"
                      name="email"
                      value={loginModel.email}
                      onChange={(e: any) => handleChangeInput(e, loginModel, setLoginModel)}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="loginFormPassword">
                    <Form.Label>Şifre</Form.Label>
                    <Form.Control
                      className={errors.password && "is-invalid"}
                      type="password"
                      placeholder="Şifrenizi giriniz"
                      name="password"
                      value={loginModel.password}
                      onChange={(e: any) => handleChangeInput(e, loginModel, setLoginModel)}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                  </Form.Group>
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin-pulse" /> : "Giriş Yap"}
                  </Button>
                </FormikForm>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
}

const defaultLoginModel: LoginCommand = {
  email: "",
  password: "",
};
