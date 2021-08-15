var chai = require("chai");
var chaiHttp = require("chai-http");
var assert = require("assert");
chai.use(chaiHttp);
describe("Test top level / routes", function () {
  it("it should have a 200 status code", function (done) {
    chai
      .request("http://localhost:3000") // the top level web address
      .get("/") // the route to add to the top level address
      .end((err, res) => {
        // what to do once the request returns
        assert.equal(res.status, 200); // check we have the 200 OK HTTP code
        done(); // finish up
      });
  });

  it("it should have a search route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/search")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("it should have a ranking route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/ranking")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("it should have a progress route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/progress")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("it should have a viewcode route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/viewcode")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("it should have a vote route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/vote")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });
});
