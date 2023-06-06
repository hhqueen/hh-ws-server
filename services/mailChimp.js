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

async function AddOneUser(params, status) {
  try {
      // const response = await mailchimp.ping.get();
      // const response = await mailchimp.root.getRoot();
      const response = await mailchimp.lists.addListMember("4da2e25b07",{
        email_address:params.email,
        status: status,
        merge_fields: {
          FNAME: params.firstName,
          LNAME: params.lastName,
        }
      });
      console.log(response);
      return response
  } catch (error) {
      console.warn(error)
      return error
  }
}

async function AddUpdateOneUser(params, status) {
  try {
      // const response = await mailchimp.ping.get();
      // const response = await mailchimp.root.getRoot();
      const response = await mailchimp.lists.setListMember(
        "4da2e25b07",
        params.email,
        {
          email_address: params.email,
          status_if_new: "subscribed",
          status: status === true ? "subscribed" : "unsubscribed", 
          merge_fields: { 
            FNAME: params.firstName ?? "",
            LNAME: params.lastName ?? "",
          }
      },
      {
        skip_merge_validation: true
      }
      );
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