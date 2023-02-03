const db = require("../models")

const activityLogTemplate = {
    apiCall: null, 
    DB_changes_collectionName: null,
    DB_changes_documentId: null,
    DB_changes_previousValue: null,
    DB_changes_newValue:null,
    DB_query_result: null
}

async function activityLogger({
    apiCall, 
    DB_changes_collectionName,
    DB_changes_documentId,
    DB_changes_previousValue = null,
    DB_changes_newValue,
    DB_query_result = null
}) {
    const showConsoleLogs = true
    let newActivity = null
    let respError = null
    try {
        newActivity = await db.ActivityLog.create({
            apiCall, 
            DB_changes_collectionName,
            DB_changes_documentId,
            DB_changes_previousValue,
            DB_changes_newValue,
            DB_query_result
        })
        apiCall.activities.push(newActivity)
        if(showConsoleLogs) { 
            console.log(`activityLogger_newActivity:`,newActivity) 
            console.log(`activityLogger_apiCall.activities:`,apiCall.activities)
        }
    } catch (error) {
        respError = error
        if(showConsoleLogs) {console.log(`activityLogger_Error:`,error) }
    } finally {
        if(showConsoleLogs) { console.log('activityLogger_Finally') }
        newActivity.Error = respError
        await newActivity.save()
        await apiCall.save()
        return newActivity
    }

}

module.exports = {
    activityLogger,
    activityLogTemplate
}