//import { expect } from "chai";

describe("Incompatibility test", { browser: 'firefox'}, () => {
    it("Функционал не поддерживается данным браузером", () => {
        cy.visit("/");
        cy.contains("Данный браузер не поддерживает функционал этого сайта");
    });
  });