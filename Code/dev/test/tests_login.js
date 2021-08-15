var chai = require("chai");
var chaiHttp = require("chai-http");
var assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

chai.use(chaiHttp);
describe("Test login route", function () {
  it("it should have a login route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/login")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });
});
