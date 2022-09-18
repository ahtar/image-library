describe('Initialisation', { browser: '!firefox' }, () => {
    it('Начальная страница загружается и коллекции инициализируются', () => {
        cy.visit('/');
        cy.contains('Due to a restriction of the File');

        //Вызов showDirectoryPicker возможнен только через user gesture, cypress не может это сделать
        //Ожидание клика вручную.
        cy.waitUntil(
            () => {
                return cy.$$('[data-test="screen-init"]').length == 0;
            },
            { timeout: Infinity }
        );

        //Коллекции загружены.
        cy.get('[data-test="collection-card-big"]').should(
            'have.length.above',
            0
        );
    });
});
