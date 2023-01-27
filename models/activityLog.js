const mongoose = require('mongoose')

const ActivityLogsSchema = new mongoose.Schema({
    activityType:{
		type: String,
        enum: ["DB_changes", "DB_query"]
	},
    DB_changes_collectionName:{
        type: String,
        default: null
    },
    DB_changes_documentId:{
        type: String,
        default: null
    },
    DB_changes_previousValue:{
        type: Object,
        default: null
    },
    DB_changes_newValue:{
        type: Object,
        default: null
    },
    DB_query_result:{
        type: Object,
        default: null
    },
    apiCall:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "APILog",
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("ActivityLog", ActivityLogsSchema)
