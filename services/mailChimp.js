const mailchimp = require("@mailchimp/mailchimp_marketing");


mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  });

async function GetListInfo() {
  try {
      // const response = await mailchimp.ping.get();
      // const response = await mailchimp.root.getRoot();
      const response = await mailchimp.lists.getListMembersInfo("4da2e25b07");
      console.log(response);
      return response
  } catch (error) {
      console.warn(error)
      return error
  }
}

async function AddOneUser(email_addressParam, statusParam) {
  try {
      // const response = await mailchimp.ping.get();
      // const response = await mailchimp.root.getRoot();
      const response = await mailchimp.lists.addListMember("4da2e25b07",{
        email_address:email_addressParam,
        status: statusParam
      });
      console.log(response);
      return response
  } catch (error) {
      console.warn(error)
      return error
  }
}

async function AddUpdateOneUser(params) {
  try {
      // const response = await mailchimp.ping.get();
      // const response = await mailchimp.root.getRoot();
      const response = await mailchimp.lists.setListMember(
        "4da2e25b07",
        params.contact_id,
        {
          email_address: params.email_address,
          status_if_new: "subscribed",
          status: params.status, 
          merge_fields: {
            FNAME: params.info.FNAME,
            LNAME: params.info.LNAME,
            ADDRESS:params.info.ADDRESS,
            PHONE:params.info.PHONE,
            BIRTHDAY:params.info.BIRTHDAY,
          }
      });
      console.log(response);
      return response
  } catch (error) {
      console.warn(error)
      return error
  }
}

exports.GetListInfo = GetListInfo;
exports.AddOneUser = AddOneUser;
exports.AddUpdateOneUser = AddUpdateOneUser;