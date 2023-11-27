import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faRightToBracket, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Formik } from "formik";
import { useState } from "react";
import { Button, Col, Container, FormControl, FormGroup, FormLabel, InputGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { ValidationEmail, ValidationMinLength, ValidationRequired } from "../../constants/validationMessages";
import { handleChangeInput } from "../../functions";
import auth from "../../http/auth";
import LoginCommand from "../../http/auth/models/commands/login/loginCommand";
import users from "../../http/users";

export default function index() {
  const navigate = useNavigate();

  const [loginModel, setLoginModel] = useState<LoginCommand>({ ...defaultLoginModel });
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordInputType, setPasswordInputType] = useState<"text" | "password">("password");

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
      <Container className="my-3">
        <Row>
          <Col>
            <h3 className="text-inline">{pageTitle}</h3>
          </Col>
        </Row>
        <hr />
        <Row className="my-5">
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setLoginModel)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </FormGroup>
                  <FormGroup className="mb-3" controlId="loginFormPassword">
                    <FormLabel>Şifre</FormLabel>
                    <InputGroup>
                      <FormControl
                        className={errors.password && "is-invalid"}
                        type={passwordInputType}
                        placeholder="Şifrenizi giriniz"
                        name="password"
                        value={loginModel.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInput(e, setLoginModel)}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => setPasswordInputType(passwordInputType === "password" ? "text" : "password")}
                      >
                        <FontAwesomeIcon icon={passwordInputType === "password" ? faEye : faEyeSlash} />
                      </Button>
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </InputGroup>
                  </FormGroup>
                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? (
                      <FontAwesomeIcon icon={faCircleNotch} className="fa-spin-pulse" />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faRightToBracket} className="me-1" />
                        Giriş Yap
                      </>
                    )}
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
