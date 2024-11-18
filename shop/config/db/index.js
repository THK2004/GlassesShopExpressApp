const mongoose = require('mongoose');

async function connect(databaseUrl) {
    try {
        await mongoose.connect(databaseUrl, { 
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connect to ${databaseUrl} successfully!!!`);
    } catch (error) {
        console.log(`Connect ${databaseUrl} fail!!!`);
    }
}

module.exports = { connect };