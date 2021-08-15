var chai = require("chai");
var chaiHttp = require("chai-http");
var assert = require("assert");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

chai.use(chaiHttp);
describe("Test ranking route", function () {
  it("it should have a ranking route", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/ranking")
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  it("it should have a ranking route results", (done) => {
    chai
      .request("http://localhost:3000")
      .get("/ranking")
      .end((err, res) => {
        assert.equal(res.status, 200);
        const dom = new JSDOM(res.text);

        var tableRowCount =
          dom.window.document.getElementsByClassName("table")[0].rows.length >
          0;

        assert.equal(true, tableRowCount);

        done();
      });
  });
});
