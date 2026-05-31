const mongoose = require('mongoose');

async function migrate() {
  await mongoose.connect('mongodb+srv://iskcon-website:dJCRM7Baxis9glWS@website.kuzs4mh.mongodb.net/iskcon-database?retryWrites=true&w=majority');
  const db = mongoose.connection.db;

  const collections = ['events', 'bhajans', 'resources', 'temples', 'tours'];

  for (const collName of collections) {
    const coll = db.collection(collName);
    const docs = await coll.find().toArray();
    for (const doc of docs) {
      if (typeof doc._id === 'string') {
        const newDoc = { ...doc, _id: new mongoose.Types.ObjectId() };
        await coll.deleteOne({ _id: doc._id });
        await coll.insertOne(newDoc);
        console.log(`Migrated ${collName} document with string ID: ${doc._id}`);
      }
    }
  }

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(console.error);
