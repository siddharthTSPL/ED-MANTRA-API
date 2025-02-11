const CreateEmpSuccesscode = { 
    credsSendSuccess:{code:'122' , msg:'credential email send'},
    empCreatedSuccess:{code:'124' , msg:'employee created successfully'},
    userActivated:{code:'142' , msg:'status change successfully'}
  };

const commonSeccessCodes = {
    loginSuccess:{code:'129' , msg:'login Success'},
    otpSent:{code:'130' , msg:'otp send'},
    verificationSuccess:{code:'133' , msg:'otp verification success'},
    getSuccess:{code:'141' , msg:'data reterived successfully'},
    updateSuccess:{code:'144' , msg:'Update Success'}
}

  module.exports = {CreateEmpSuccesscode ,commonSeccessCodes}