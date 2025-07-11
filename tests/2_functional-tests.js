const chai = require("chai");
const assert = chai.assert;

const server = require("../server");

const chaiHttp = require("chai-http");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.timeout(5000);
  suite("Integration tests with chai-http", function () {
    // #1
    test("Test GET /hello with no name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello Guest");
          done();
        });
    });
    // #2
    test("Test GET /hello with your name", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/hello?name=xy_z")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, "hello xy_z");
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "Colombo" })
        .end(function (err, res) {
          assert.equal(
            res.body.surname,
            "Colombo",
            "Surname should be Colombo"
          );

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/travellers")
        .send({ surname: "da Verrazzano" }) // 🔑 Attach the surname data
        .end(function (err, res) {
          assert.equal(res.status, 200, "Status should be 200");
          assert.equal(res.type, "application/json", "Response should be JSON");
          assert.equal(res.body.name, "Giovanni", "Name should be Giovanni");
          assert.equal(
            res.body.surname,
            "da Verrazzano",
            "Surname should be da Verrazzano"
          );
          done();
        });
    });
  });
});

const Browser = require("zombie");

suite("Functional Tests with Zombie.js", function () {
  this.timeout(5000);

  suite("Headless browser", function () {
    test('should have a working "site" property', function () {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      browser.visit("/", function () {
        browser.fill("surname", "Colombo").pressButton("submit", function () {
          assert.equal(browser.statusCode, 200);
          assert.equal(browser.text("span#name"), "Cristoforo");
          assert.equal(browser.text("span#surname"), "Colombo");
          done();
        });
      });
    });
  });
  // #6
  test('Submit the surname "Vespucci" in the HTML form', function (done) {
    browser.visit("/", function () {
      browser.fill("surname", "Vespucci").pressButton("submit", function () {
        assert.equal(browser.statusCode, 200);
        assert.equal(browser.text("span#name"), "Amerigo");
        assert.equal(browser.text("span#surname"), "Vespucci");
        done();
      });
    });
  });
});
