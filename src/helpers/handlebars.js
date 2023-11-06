const Handlebars = require('handlebars');

Handlebars.registerHelper('calculatePages', function (products, pageSize) {
    return Math.ceil(products.length / pageSize);
});

Handlebars.registerHelper('paginate', function (totalPages, currentPage) {
    let output = '';

    for (let i = 1; i <= totalPages; i++) {
        output += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
    }

    return new Handlebars.SafeString(output);
});


module.exports = {
    sum: (a, b) => a + b,
    gt: (a, b) => a > b,
    substract: (a, b) => a - b,
    sumByField: (model, field) => {
        var total = 0;
        for (let index = 0; index < model.length; index++) {
            total += model[index][field];
        }
        return total;
    },
    profit: (a, b) => {
        a = parseFloat(a);
        b = parseFloat(b);
        if (a < b) return b - a;
        return a - b;
    },
    sortable: (field, sort) => {

        const sortType = field === sort.column ? sort.type : 'default';

        const icons = {
            default: 'fa-solid fa-filter',
            ASC: 'fa-solid fa-arrow-up-wide-short',
            DESC: 'fa-solid fa-arrow-down-wide-short',
        };

        const types = {
            default: 'ASC',
            ASC: 'DESC',
            DESC: 'ASC',
        };

        const icon = icons[sortType];
        const type = types[sortType];

        const href = Handlebars.escapeExpression(`?page=${typeof sort.page === 'number' ? sort.page : 1}&_sort&column=${field}&type=${type}`);

        const output = `<a href="${href}">
                        <i class="${icon}"></i>
                        </a>`;

        return new Handlebars.SafeString(output);
    },
    calculatePages: (products, pageSize) => {
        Math.ceil(products.length / pageSize);
    },
    paginate: (totalPages, currentPage) => {
        let output = '';

        for (let i = 1; i <= totalPages; i++) {
            output += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
        }

        return new Handlebars.SafeString(output);
    },
    ifOrCond: (v1, v2) => {
        return v1 || v2;
    }
}