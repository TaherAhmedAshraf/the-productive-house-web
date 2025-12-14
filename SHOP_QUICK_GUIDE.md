# Quick Guide - Shop & Product Pages

## 🛍️ Shop Page (`/shop`)

### Features at a Glance

#### Filtering
- **Categories**: All Products, Planners, Journals, Notebooks, Accessories
- **Price Range**: Slider from £0 to £100
- **Stock Status**: Toggle for in-stock items only
- **Reset Button**: Clear all filters instantly

#### Sorting
- Featured (default)
- Price: Low to High
- Price: High to Low
- Name: A to Z
- Highest Rated

#### Product Display
- Responsive grid (1-3 columns based on screen size)
- Product image with hover zoom
- Badges (Bestseller, New)
- Star ratings
- Review count
- Price
- Two action buttons: "View Details" and "Add to Cart"

### How to Use

1. **Browse All Products**
   - Visit `/shop` to see all products
   - Scroll through the grid

2. **Filter by Category**
   - Click a category in the sidebar
   - Products update instantly

3. **Adjust Price Range**
   - Drag the price slider
   - See filtered results in real-time

4. **Sort Products**
   - Use the "Sort by" dropdown
   - Choose your preferred sorting

5. **View Product**
   - Click product image or "View Details"
   - Opens product detail page

6. **Quick Add to Cart**
   - Click "Add to Cart" directly from shop page
   - Toast notification appears
   - Cart badge updates

---

## 📦 Product Detail Page (`/product/[id]`)

### Features at a Glance

#### Image Gallery
- Large main product image
- Thumbnail gallery (if multiple images)
- Click thumbnails to change main image
- Active thumbnail highlighted

#### Product Information
- Product name with badge
- Star rating and review count
- Price and stock status
- Detailed description
- Breadcrumb navigation

#### Purchase Controls
- Quantity selector (+/- buttons)
- Add to Cart button
- Wishlist button (heart icon)
- Disabled for out-of-stock items

#### Detailed Content (Tabs)
1. **Description**: Full product description
2. **Features**: Bulleted list with checkmarks
3. **Specifications**: Technical details table

#### Additional Info
- Free shipping notice (£40+)
- 30-day return policy
- Secure checkout badge

#### Related Products
- 4 similar products from same category
- Quick navigation to other products

### How to Use

1. **View Product Images**
   - Main image shows by default
   - Click thumbnails to see other angles
   - Hover for zoom (future feature)

2. **Read Product Details**
   - Scroll down for description
   - Click tabs for features and specs
   - Check ratings and reviews

3. **Select Quantity**
   - Click `-` to decrease
   - Click `+` to increase
   - Default is 1

4. **Add to Cart**
   - Click "Add to Cart" button
   - Toast notification confirms
   - Cart icon updates with count

5. **Explore Related Products**
   - Scroll to bottom
   - Click any related product
   - Navigate to that product's page

6. **Navigate Back**
   - Use breadcrumbs at top
   - Click "Shop" to return to shop page
   - Click category to filter shop by category

---

## 🎨 Design Elements

### Color Scheme
- **Primary**: Navy Blue (#1d2a48)
- **Accent**: Cyan (#56cfe1)
- **Background**: Light Gray (#f9fafb)
- **Text**: Dark Brown (#2c2823)

### Typography
- **Headings**: Bold, large sizes
- **Body**: Lato font, readable line height
- **Prices**: Bold, prominent display

### Interactive Elements
- **Hover Effects**: Scale, color change
- **Transitions**: Smooth 300ms
- **Buttons**: Clear states (default, hover, disabled)

---

## 📱 Responsive Behavior

### Mobile (< 640px)
- Single column product grid
- Filters collapse (ready for drawer)
- Stacked layout
- Touch-friendly buttons

### Tablet (640px - 1024px)
- 2-column product grid
- Sidebar visible
- Optimized spacing

### Desktop (> 1024px)
- 3-column product grid
- Full sidebar with filters
- Sticky filter panel
- Hover effects active

---

## 🔍 Product Catalog

### Current Products (10)

**Planners:**
1. Daily Planner 2024 - £29.99 ⭐ 4.8 (Bestseller)
2. Weekly Productivity Planner - £34.99 ⭐ 4.9 (New)
3. Monthly Planner Set - £44.99 ⭐ 4.7
4. Professional Planner - £39.99 ⭐ 4.9

**Journals:**
5. Goal Setting Journal - £24.99 ⭐ 4.6
6. Habit Tracker - £19.99 ⭐ 4.5
7. Wellness Journal - £27.99 ⭐ 4.8

**Notebooks:**
8. Minimalist Notebook - £16.99 ⭐ 4.4

**Accessories:**
9. Desk Organizer Set - £32.99 ⭐ 4.6
10. Premium Pen Collection - £24.99 ⭐ 4.7

---

## 🚀 Quick Actions

### From Homepage
```
Click "View All Products" → Shop Page
Click any product card → Product Detail
```

### From Shop Page
```
Filter → Select category → View filtered results
Sort → Choose option → See sorted products
Click product → View details
Add to Cart → Toast appears → Continue shopping
```

### From Product Detail
```
View images → Click thumbnails
Read details → Click tabs
Select quantity → Use +/- buttons
Add to cart → Click button → See toast
View related → Click product → Navigate
```

---

## 💡 Tips

### For Best Experience
1. **Use Filters**: Narrow down products by category and price
2. **Check Ratings**: See what other customers think
3. **Read Features**: Click Features tab for full details
4. **View Specs**: Check Specifications for technical info
5. **Explore Related**: Discover similar products

### Shopping Smart
- 🚚 **Free Shipping**: Spend £40 or more
- 🔄 **Returns**: 30-day return policy
- ⭐ **Ratings**: Higher ratings = better quality
- 🏷️ **Badges**: Look for "Bestseller" and "New" tags

---

## 🛠️ For Developers

### Adding New Products
Edit `app/data/products.ts`:
```typescript
{
  id: 11,
  name: 'New Product',
  price: 29.99,
  image: 'url',
  category: 'Planners',
  description: '...',
  inStock: true,
  rating: 4.5,
  reviews: 100,
}
```

### Customizing Filters
Edit `app/shop/page.tsx`:
- Add new filter types
- Modify price range
- Add custom sorting options

### Styling
- Colors: `tailwind.config.ts`
- Components: Individual page files
- Global: `app/globals.css`

---

## 📞 Support

For issues:
- Check console for errors
- Verify product data in `app/data/products.ts`
- Review component props
- Check routing configuration

---

**The shop and product pages are ready to provide a premium shopping experience!** 🎉
