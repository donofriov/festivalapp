const aws = require('aws-sdk')

exports.handler = async (event, context, callback) => {
  const cognitoProvider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })

  let isAdmin = false
  // Set admin emails here
  const adminEmails = ['donofriov@gmail.com']

  // If the user is one of the admins, set the isAdmin variable to true
  if (adminEmails.indexOf(event.request.userAttributes.email) !== -1) {
    isAdmin = true
  }

  const groupParams = {
    UserPoolId: event.userPoolId,
  }

  const userParams = {
    UserPoolId: event.userPoolId,
    Username: event.userName,
  }

  if (isAdmin) {
    groupParams.GroupName = 'Admin'
    userParams.GroupName = 'Admin'

    // First check to see if the group exists, and if not create the group
    try {
      await cognitoProvider.getGroup(groupParams).promise()
    } catch (err) {
      await cognitoProvider.createGroup(groupParams).promise()
    }
  } else {
    // If the user is in neither gorup, proceed with no action
    callback(null, event)
  }
}
