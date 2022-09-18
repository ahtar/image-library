describe('Коллекции', () => {
    before(() => {
        cy.visit('/');

        cy.contains('Due to a restriction of the File');

        cy.waitUntil(
            () => {
                return cy.$$('[data-test="screen-init"]').length == 0;
            },
            { timeout: Infinity }
        );

        //cy.get('[data-test="collection-card-big"]').should('have.length.above', 0);
    });

    it('Новая коллекция создается', () => {
        cy.readFile('./tests/e2e/dummy.jpg', null, { log: true }).then(
            (obj: Blob) => {
                const file = new File([obj], 'image.jpg', {
                    type: 'image/jpg',
                });
                const item = new ClipboardItem({ [file.type]: file });

                cy.get('body').focus().click();

                //navigator.clipboard.write([item]);
            }
        );
        //Открывается окно создания коллекций.
        cy.get('[data-test="home-card-new"]').click();

        //cy.get('[data-test="collection-create-wrapper"]');

        //Заполняются данные новой коллекции.
        cy.get('[data-test="collection-create-name"] input').type(
            'cypressCollection'
        );
        cy.get('[data-test="collection-create-theme"] input').type(
            'cypress collection theme'
        );
        cy.get('[data-test="collection-create-description"] textarea').type(
            'cypress collection description'
        );
        cy.get('[data-test="collection-create-corrupted"] input').check();

        //Вставляется изображение.
        cy.get('[data-test="collection-create-image"]').rightclick();
        cy.get('[data-test="input-image-context-paste"]').click();

        cy.get('[data-test="collection-create-save"]').click();
    });
});
