var chai = require("chai");
var chaiHttp = require("chai-http");
var assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

chai.use(chaiHttp);
describe("Test search route", function () {
  it("it should have a search route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/search")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("it should have a search route results", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/search?search=javascript")
      .end((err, res) => {
        assert.equal(res.status, 200);
        const dom = new JSDOM(res.text);

        let languageResults =
          dom.window.document.getElementById("languages").children.length > 0;

        let frameworkResults =
          dom.window.document.getElementById("frameworks").children.length > 0;

        assert.equal(true, languageResults);
        assert.equal(true, frameworkResults);
        done();
      });
  });
});
