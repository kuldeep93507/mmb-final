# MMB Portfolio Website - API Contracts

## Admin Panel Backend Implementation

### Authentication Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/verify` - Verify admin token

### Services Management
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Create new service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

### Projects Management
- `GET /api/admin/projects` - Get all projects
- `POST /api/admin/projects` - Create new project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

### Testimonials Management
- `GET /api/admin/testimonials` - Get all testimonials
- `POST /api/admin/testimonials` - Create new testimonial
- `PUT /api/admin/testimonials/:id` - Update testimonial
- `DELETE /api/admin/testimonials/:id` - Delete testimonial

### Blog Management
- `GET /api/admin/blogs` - Get all blog posts
- `POST /api/admin/blogs` - Create new blog post
- `PUT /api/admin/blogs/:id` - Update blog post
- `DELETE /api/admin/blogs/:id` - Delete blog post

### Contact Management
- `GET /api/admin/contacts` - Get all contact inquiries
- `DELETE /api/admin/contacts/:id` - Delete contact inquiry
- `PUT /api/admin/contacts/:id/read` - Mark as read

### Dashboard Stats
- `GET /api/admin/stats` - Get dashboard statistics

## Database Models

### Admin Model
- email: String (unique)
- password: String (hashed)
- name: String
- role: String (default: 'admin')

### Service Model
- title: String
- description: String
- price: String
- duration: String
- features: Array of Strings
- icon: String
- active: Boolean

### Project Model
- title: String
- description: String
- image: String (URL)
- category: String
- tags: Array of Strings
- technologies: Array of Strings
- liveUrl: String
- githubUrl: String
- featured: Boolean

### Testimonial Model
- name: String
- position: String
- company: String
- text: String
- rating: Number
- image: String (URL)
- approved: Boolean

### Blog Post Model
- title: String
- excerpt: String
- content: String
- image: String (URL)
- category: String
- tags: Array of Strings
- author: String
- publishDate: Date
- published: Boolean

### Contact Inquiry Model
- name: String
- email: String
- phone: String
- projectType: String
- budget: String
- message: String
- timeline: String
- read: Boolean
- createdAt: Date

## Frontend Admin Panel Structure

### Pages
1. `/admin/login` - Admin login page
2. `/admin/dashboard` - Main dashboard with stats
3. `/admin/services` - Services management
4. `/admin/projects` - Projects management
5. `/admin/testimonials` - Testimonials management
6. `/admin/blog` - Blog management
7. `/admin/contacts` - Contact inquiries

### Components
- AdminLayout - Main admin layout with sidebar
- AdminSidebar - Navigation sidebar
- DataTable - Reusable data table component
- AdminForm - Reusable form component
- StatsCard - Dashboard stats cards

## Authentication Flow
1. Admin enters credentials on login page
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Protected routes check for valid token
5. Auto logout on token expiry

## Mock Data Integration
- Replace mock data in frontend with real API calls
- Maintain same data structure for seamless integration
- Add loading states and error handling