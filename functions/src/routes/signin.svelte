<script>
  import validate from "validate.js"
  import firebase from "firebase/app"
  import EmailInput from "../components/forms/email_input.svelte"
  import FormButtons from "../components/forms/buttons.svelte"
  import { init } from "../config/firebase"

  const loginConstraints = {
    email: {
      presence: true,
      email: true,
    },
  }

  let email = ""
  let emailError = false
  let emailMessage = ""
  let disableAction = false

  const resetErrorInfo = () => {
    let emailError = false
    let emailMessage = ""
  }

  const validateSigninForm = () => {
    resetErrorInfo()
    const validationResult = validate({ email }, loginConstraints)
    if (!validationResult) {
      return true
    } else {
      if (validationResult.email && validationResult.email.length > 0) {
        emailMessage = validationResult.email[0]
        emailError = true
      }
    }

    return false
  }

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: window.location.href,
    // This must be true.
    handleCodeInApp: true,
  }

  const signInUser = () => {
    disableAction = true
    if (validateSigninForm()) {
      init()
        .Auth.sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function() {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem("emailForSignIn", email)
          resolve()
        })
        .catch(function(error) {
          console.log(error)
          // Some error occurred, you can inspect the code: error.code
          reject()
        })
    } else {
      disableAction = false
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h1>Login</h1>

<form ref="form" on:submit|preventDefault={signInUser}>
  <EmailInput
    bind:value={email}
    error={emailError}
    errorMessage={emailMessage} />
  <FormButtons
    cancelButton={false}
    submitText="Login"
    isLoading={disableAction} />
</form>
