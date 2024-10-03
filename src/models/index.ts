import Advisor from './advisor';
import Product from './product';

// Advisor has many Products
Advisor.hasMany(Product, {
    foreignKey: 'advisorId',
    as: 'products',
    onUpdate: 'CASCADE',
});

// Product belongs to an Advisor
Product.belongsTo(Advisor, {
    foreignKey: 'advisorId',
    as: 'advisor',
});

export { Advisor, Product };
