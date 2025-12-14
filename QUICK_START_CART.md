# Quick Start Guide - Cart & Checkout

## 🛒 How to Use the Shopping Cart

### Adding Items
1. Browse products on the home page
2. Click **"Add to Cart"** button on any product
3. Cart drawer automatically slides in from the right
4. Item is added with quantity of 1

### Managing Cart Items

#### In Cart Drawer:
- **Increase quantity**: Click `+` button
- **Decrease quantity**: Click `-` button
- **Remove item**: Click "Remove" link
- **View full cart**: Click "View Cart" button
- **Checkout**: Click "Checkout" button
- **Close drawer**: Click X or click outside

#### In Cart Page:
- Same controls as drawer, plus:
- **Apply promo code**: Enter code and click "Apply"
  - Try code: `SAVE10` for 10% off
- See detailed order summary
- Free shipping indicator (spend £40+)

### Checkout Process

#### Step 1: Information
Fill out:
- Email address
- First and last name
- Shipping address
- City and postal code
- Country
- Phone number

Click **"Continue"** to proceed

#### Step 2: Shipping Method
- Standard shipping selected by default
- Free if order is £40 or more
- Otherwise £4.99

Click **"Continue"** to proceed

#### Step 3: Payment
Enter payment details:
- Card number
- Name on card
- Expiry date (MM/YY)
- CVV

⚠️ **Demo Mode**: No real payment is processed

Click **"Place Order"** to complete

## 💡 Tips

### Free Shipping
- Add £40 or more to your cart for free shipping
- Cart page shows how much more you need to spend

### Promo Codes
- Current demo code: `SAVE10`
- Gives 10% discount on cart total
- Enter on cart page before checkout

### Cart Persistence
- Your cart is saved automatically
- Items remain even if you close the browser
- Cart syncs across browser tabs

## 🎨 Features

### Visual Feedback
- Cart count badge on header icon
- Smooth drawer animations
- Hover effects on buttons
- Progress indicator in checkout

### Responsive Design
- Works on mobile, tablet, and desktop
- Touch-friendly buttons
- Optimized layouts for each screen size

### Security
- Secure checkout badge displayed
- HTTPS ready
- Form validation

## 🔧 For Developers

### Using Cart Context

```typescript
import { useCart } from '@/app/context/CartContext';

function MyComponent() {
  const { 
    cart,           // Array of cart items
    addToCart,      // Function to add item
    removeFromCart, // Function to remove item
    updateQuantity, // Function to update quantity
    clearCart,      // Function to empty cart
    cartCount,      // Total number of items
    cartTotal,      // Total price
    isCartOpen,     // Cart drawer state
    setIsCartOpen   // Function to toggle drawer
  } = useCart();
  
  return (
    <button onClick={() => addToCart({
      id: 1,
      name: 'Product',
      price: 29.99,
      image: '/image.jpg'
    })}>
      Add to Cart
    </button>
  );
}
```

### Cart Item Interface

```typescript
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
```

### Routes
- `/` - Home page with products
- `/cart` - Full cart page
- `/checkout` - Checkout flow

## 📱 Testing Checklist

- [ ] Add item to cart
- [ ] Update quantity in drawer
- [ ] Remove item from cart
- [ ] Close and reopen cart drawer
- [ ] Navigate to cart page
- [ ] Apply promo code
- [ ] Navigate to checkout
- [ ] Fill out shipping info
- [ ] Complete checkout flow
- [ ] Test on mobile device
- [ ] Test cart persistence (refresh page)

## 🐛 Troubleshooting

### Cart not updating?
- Check browser console for errors
- Ensure JavaScript is enabled
- Clear localStorage and try again

### Checkout not working?
- All required fields must be filled
- Email must be valid format
- Card number must be entered (any number works in demo)

### Cart drawer not opening?
- Click the cart icon in header
- Check if items are in cart
- Try refreshing the page

## 🚀 Next Steps

### Recommended Enhancements:
1. **Backend Integration**
   - Connect to payment gateway (Stripe/PayPal)
   - Create order processing API
   - Add inventory management

2. **User Features**
   - User accounts and login
   - Save shipping addresses
   - Order history

3. **Product Features**
   - Product detail pages
   - Product variants (size, color)
   - Product reviews

4. **Cart Enhancements**
   - Wishlist/Save for later
   - Gift options
   - Quantity limits

5. **Analytics**
   - Track cart abandonment
   - Conversion funnel
   - A/B testing

## 📞 Support

For issues or questions:
- Check the main README.md
- Review CART_CHECKOUT_README.md for technical details
- Check browser console for errors
