import EmailValidator from 'email-validator'

class ValidateField {
    constructor(fieldname) {
      this.fieldname = fieldname
      this.valid = true
      this.message = ''
    }
    minlength(num,customMessage) {
      if (this.fieldname.length < num) {
        this.message = customMessage ? customMessage : `Field length must be at least ${num} characters`
        this.valid = false
      }
      return this
    }
    maxlength(num,customMessage) {
      if (this.fieldname.length > num) {
        this.message = customMessage ? customMessage : `Field length cannot be more than ${num} characters`
        this.valid = false
      }
      return this
    }
    isEmail(customMessage) {
      if (!EmailValidator.validate(this.fieldname)) {
        this.message = customMessage ? customMessage : `Please input a valid email address`
        this.valid = false
      }
      return this
    }
    result() {
        return { isValid: this.valid, message: this.message }
    }
  }

  export default ValidateField