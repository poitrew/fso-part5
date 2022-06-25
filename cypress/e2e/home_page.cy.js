describe('Blog app', () => {
    beforeEach(() => {
        cy.request('POST', '/api/test/reset')
        cy.request('POST', '/api/users', {
            name: 'Daniel',
            username: 'daniel',
            password: 'leinad',
        })
        localStorage.clear()
        cy.visit('/')
    })

    it('Login form is shown', () => {
        cy.get('h2').should('contain', 'log in')
        cy.get('form').should('descendants', 'input').and('descendants', 'button')
    })


    describe('Login', () => {
        it('succeed with correct credentials', () => {
            cy.get('#username').type('daniel')
            cy.get('#password').type('leinad')
            cy.contains('login').click()
            cy.contains('Daniel logged in')
        })

        it('fails with wrong credentails', () => {
            cy.get('#username').type('daniel')
            cy.get('#password').type('wrong')
            cy.contains('login').click()

            cy.get('.noti')
                .should('contain', 'Wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', () => {
        beforeEach(() => {
            cy.login({ username: 'daniel', password: 'leinad' })
        })

        it('a blog can be created', () => {
            cy.visit('/')
            cy.contains ('new blog').click()

            cy.get('#blog-title').type('test title')
            cy.get('#blog-author').type('test author')
            cy.get('#blog-url').type('test url')
            cy.contains('create').click()

            cy.get('.blog').should('contain', 'test title test author')
        })

        it('a random blog can increase like when like button clicked', () => {
            cy.addBlog({ title: 'title 1', author: 'author 1', url: 'url 1' })
            cy.addBlog({ title: 'title 2', author: 'author 2', url: 'url 2' })
            cy.addBlog({ title: 'title 3', author: 'author 3', url: 'url 3' })
            cy.visit('/')

            cy.contains('title 2').parent().contains('view').click()
            cy.contains('like').click()
            cy.contains('likes ').should('contain', '1')
        })

        it('user who create the blog can delete it', () => {
            cy.addBlog({ title: 'title 1', author: 'author 1', url: 'url 1' })
            cy.visit('/')

            cy.contains('title 1').parent().contains('view').click()
            cy.contains('remove').click()
            cy.get('.blogs').should('not.contain', 'title 1')
        })

        it('other user can not delete this user\'s blog', () => {
            cy.addBlog({ title: 'title 1', author: 'author 1', url: 'url 1' })

            cy.request('POST', '/api/users', { username: 'another', password: 'rehtona' , name: 'Another one' })
            cy.login({ username: 'another', password: 'rehtona' })
            cy.visit('/')

            cy.contains('title 1').parent().contains('view').click()
            cy.contains('remove').click()

            cy.get('.blogs').should('contain', 'title 1')
        })

        it('blogs are ordered according to likes', () => {
            cy.addBlog({ title: 'title 1', author: 'author 1', url: 'url 1' })
            cy.addBlog({ title: 'title 2', author: 'author 2', url: 'url 2' })
            cy.visit('/')

            cy.get('.blog').eq(0).should('contain', 'title 1')
            cy.get('.blog').eq(1).should('contain', 'title 2')
            cy.get('.blog').eq(1).contains('view').click()
            cy.intercept('/api/blogs/*').as('likeUpdate')
            cy.contains('like').click()
            cy.wait('@likeUpdate')

            cy.get('.blog').eq(0).should('contain', 'title 2')
        })
    })
})