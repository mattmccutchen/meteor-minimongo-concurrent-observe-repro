Fiber = require("fibers");

// Uncomment to make the bug go away:
//Meteor._SynchronousQueue.prototype.drain = Meteor._SynchronousQueue.prototype.flush;

const NUM_DOCS = 100;
let collection = new LocalCollection();
for (let i = 0; i < NUM_DOCS; i++)
  collection.insert({_id: "doc" + i});

for (let t = 0; t < 2; t++) {
  Fiber(function() {
    let counter = 0;
    collection.find().observe({
      added: (document) => {
        counter++;
      }
    });
    if (counter < NUM_DOCS) {
      console.log(`Bug: Thread ${t} got only ${counter} docs before observe returned!`);
    } else {
      console.log(`Thread ${t} is OK.`);
    }
  }).run();
}
