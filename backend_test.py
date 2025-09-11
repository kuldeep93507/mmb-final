#!/usr/bin/env python3
"""
Backend API Testing Suite for MMB Portfolio Admin Panel
Tests all admin panel endpoints and public APIs
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://portfolio-admin-9.preview.emergentagent.com/api"
ADMIN_CREDENTIALS = {
    "email": "admin@mmb.dev",
    "password": "admin123"
}

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.token = None
        self.headers = {"Content-Type": "application/json"}
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, auth_required: bool = False) -> tuple:
        """Make HTTP request with proper headers"""
        url = f"{self.base_url}{endpoint}"
        headers = self.headers.copy()
        
        if auth_required and self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method == "POST":
                response = requests.post(url, headers=headers, json=data, timeout=30)
            elif method == "PUT":
                response = requests.put(url, headers=headers, json=data, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                return False, {"error": f"Unsupported method: {method}"}
            
            return True, {
                "status_code": response.status_code,
                "response": response.json() if response.content else {},
                "headers": dict(response.headers)
            }
        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}
        except json.JSONDecodeError as e:
            return False, {"error": f"JSON decode error: {str(e)}", "response_text": response.text}
    
    def test_admin_login(self):
        """Test admin login functionality"""
        print("\n=== Testing Admin Login ===")
        
        success, result = self.make_request("POST", "/admin/login", ADMIN_CREDENTIALS)
        
        if not success:
            self.log_test("Admin Login", False, "Request failed", result)
            return False
        
        if result["status_code"] == 200:
            response_data = result["response"]
            if "access_token" in response_data:
                self.token = response_data["access_token"]
                self.log_test("Admin Login", True, "Login successful, token received")
                return True
            else:
                self.log_test("Admin Login", False, "No access token in response", response_data)
                return False
        else:
            self.log_test("Admin Login", False, f"Login failed with status {result['status_code']}", result["response"])
            return False
    
    def test_admin_verify(self):
        """Test admin token verification"""
        print("\n=== Testing Admin Token Verification ===")
        
        if not self.token:
            self.log_test("Admin Verify", False, "No token available for verification")
            return False
        
        success, result = self.make_request("GET", "/admin/verify", auth_required=True)
        
        if not success:
            self.log_test("Admin Verify", False, "Request failed", result)
            return False
        
        if result["status_code"] == 200:
            self.log_test("Admin Verify", True, "Token verification successful")
            return True
        else:
            self.log_test("Admin Verify", False, f"Verification failed with status {result['status_code']}", result["response"])
            return False
    
    def test_services_crud(self):
        """Test Services CRUD operations"""
        print("\n=== Testing Services CRUD ===")
        
        if not self.token:
            self.log_test("Services CRUD", False, "No authentication token available")
            return False
        
        # Test GET services
        success, result = self.make_request("GET", "/admin/services", auth_required=True)
        if success and result["status_code"] == 200:
            self.log_test("GET Services", True, f"Retrieved {len(result['response'])} services")
        else:
            self.log_test("GET Services", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
            return False
        
        # Test POST service (create)
        test_service = {
            "title": "Test Web Development Service",
            "description": "Professional web development services for modern businesses",
            "price": "$2,500 - $10,000",
            "duration": "4-8 weeks",
            "features": [
                "Responsive Design",
                "SEO Optimization",
                "Performance Optimization",
                "Cross-browser Compatibility"
            ],
            "icon": "🌐",
            "active": True
        }
        
        success, result = self.make_request("POST", "/admin/services", test_service, auth_required=True)
        service_id = None
        if success and result["status_code"] == 200:
            service_id = result["response"].get("id")
            self.log_test("POST Service", True, f"Service created with ID: {service_id}")
        else:
            self.log_test("POST Service", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
            return False
        
        # Test PUT service (update)
        if service_id:
            update_data = {
                "title": "Updated Test Web Development Service",
                "price": "$3,000 - $12,000"
            }
            success, result = self.make_request("PUT", f"/admin/services/{service_id}", update_data, auth_required=True)
            if success and result["status_code"] == 200:
                self.log_test("PUT Service", True, f"Service {service_id} updated successfully")
            else:
                self.log_test("PUT Service", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
        
        # Test DELETE service
        if service_id:
            success, result = self.make_request("DELETE", f"/admin/services/{service_id}", auth_required=True)
            if success and result["status_code"] == 200:
                self.log_test("DELETE Service", True, f"Service {service_id} deleted successfully")
            else:
                self.log_test("DELETE Service", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
        
        return True
    
    def test_projects_crud(self):
        """Test Projects CRUD operations"""
        print("\n=== Testing Projects CRUD ===")
        
        if not self.token:
            self.log_test("Projects CRUD", False, "No authentication token available")
            return False
        
        # Test GET projects
        success, result = self.make_request("GET", "/admin/projects", auth_required=True)
        if success and result["status_code"] == 200:
            self.log_test("GET Projects", True, f"Retrieved {len(result['response'])} projects")
        else:
            self.log_test("GET Projects", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
            return False
        
        # Test POST project (create)
        test_project = {
            "title": "E-Commerce Platform",
            "description": "Modern e-commerce platform built with React and Node.js featuring real-time inventory management",
            "image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
            "category": "Web Development",
            "tags": ["E-commerce", "React", "Node.js", "MongoDB"],
            "technologies": ["React", "Node.js", "Express", "MongoDB", "Stripe"],
            "live_url": "https://demo-ecommerce.mmb.dev",
            "github_url": "https://github.com/mmb/ecommerce-platform",
            "featured": True
        }
        
        success, result = self.make_request("POST", "/admin/projects", test_project, auth_required=True)
        project_id = None
        if success and result["status_code"] == 200:
            project_id = result["response"].get("id")
            self.log_test("POST Project", True, f"Project created with ID: {project_id}")
        else:
            self.log_test("POST Project", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
            return False
        
        # Clean up - delete the test project
        if project_id:
            success, result = self.make_request("DELETE", f"/admin/projects/{project_id}", auth_required=True)
            if success and result["status_code"] == 200:
                self.log_test("DELETE Project (cleanup)", True, f"Test project {project_id} deleted successfully")
            else:
                self.log_test("DELETE Project (cleanup)", False, f"Failed to delete test project", result)
        
        return True
    
    def test_contacts_management(self):
        """Test Contacts management"""
        print("\n=== Testing Contacts Management ===")
        
        # Test public contact form submission (POST /contact)
        test_contact = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@techstartup.com",
            "phone": "+1-555-0123",
            "project_type": "Web Development",
            "budget": "$10,000 - $25,000",
            "message": "We need a modern web application for our startup. Looking for a full-stack solution with user authentication, payment processing, and admin dashboard.",
            "timeline": "3-4 months"
        }
        
        success, result = self.make_request("POST", "/contact", test_contact)
        contact_id = None
        if success and result["status_code"] == 200:
            contact_id = result["response"].get("id")
            self.log_test("POST Contact (Public)", True, f"Contact form submitted with ID: {contact_id}")
        else:
            self.log_test("POST Contact (Public)", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
            return False
        
        # Test admin contacts retrieval (GET /admin/contacts)
        if not self.token:
            self.log_test("GET Admin Contacts", False, "No authentication token available")
            return False
        
        success, result = self.make_request("GET", "/admin/contacts", auth_required=True)
        if success and result["status_code"] == 200:
            contacts = result["response"]
            self.log_test("GET Admin Contacts", True, f"Retrieved {len(contacts)} contacts")
            
            # Verify our test contact is in the list
            if contact_id:
                found_contact = any(contact.get("id") == contact_id for contact in contacts)
                if found_contact:
                    self.log_test("Contact Verification", True, "Test contact found in admin contacts list")
                else:
                    self.log_test("Contact Verification", False, "Test contact not found in admin contacts list")
        else:
            self.log_test("GET Admin Contacts", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
            return False
        
        return True
    
    def test_public_apis(self):
        """Test public APIs that frontend uses"""
        print("\n=== Testing Public APIs ===")
        
        # Test GET /services (public)
        success, result = self.make_request("GET", "/services")
        if success and result["status_code"] == 200:
            services = result["response"]
            self.log_test("GET Public Services", True, f"Retrieved {len(services)} public services")
        else:
            self.log_test("GET Public Services", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
        
        # Test GET /projects (public)
        success, result = self.make_request("GET", "/projects")
        if success and result["status_code"] == 200:
            projects = result["response"]
            self.log_test("GET Public Projects", True, f"Retrieved {len(projects)} public projects")
        else:
            self.log_test("GET Public Projects", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
        
        # Test GET /testimonials (public)
        success, result = self.make_request("GET", "/testimonials")
        if success and result["status_code"] == 200:
            testimonials = result["response"]
            self.log_test("GET Public Testimonials", True, f"Retrieved {len(testimonials)} public testimonials")
        else:
            self.log_test("GET Public Testimonials", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
        
        # Test GET /blogs (public)
        success, result = self.make_request("GET", "/blogs")
        if success and result["status_code"] == 200:
            blogs = result["response"]
            self.log_test("GET Public Blogs", True, f"Retrieved {len(blogs)} public blogs")
        else:
            self.log_test("GET Public Blogs", False, f"Failed with status {result.get('status_code', 'unknown')}", result)
        
        return True
    
    def test_profile_update_flow(self):
        """Test complete profile update flow end-to-end"""
        print("\n=== Testing Profile Update Flow ===")
        
        if not self.token:
            self.log_test("Profile Update Flow", False, "No authentication token available")
            return False
        
        # Step 1: Get current public profile data
        success, result = self.make_request("GET", "/profile")
        if not success or result["status_code"] != 200:
            self.log_test("GET Public Profile (Initial)", False, f"Failed to get public profile: {result.get('status_code', 'unknown')}", result)
            return False
        
        initial_profile = result["response"]
        initial_phone = initial_profile.get("phone", "")
        self.log_test("GET Public Profile (Initial)", True, f"Retrieved public profile with phone: {initial_phone}")
        
        # Step 2: Get admin profile data
        success, result = self.make_request("GET", "/admin/profile", auth_required=True)
        if not success or result["status_code"] != 200:
            self.log_test("GET Admin Profile", False, f"Failed to get admin profile: {result.get('status_code', 'unknown')}", result)
            return False
        
        admin_profile = result["response"]
        self.log_test("GET Admin Profile", True, f"Retrieved admin profile with phone: {admin_profile.get('phone', '')}")
        
        # Step 3: Update profile with new phone number
        new_phone = "+91 9876543211"  # Added one digit at end as requested
        update_data = {
            "name": admin_profile.get("name", "Kuldeep Parjapati"),
            "email": admin_profile.get("email", "hello@mmb.dev"),
            "phone": new_phone,
            "whatsapp": new_phone,  # Update WhatsApp number too
            "address": admin_profile.get("address", "India"),
            "bio": admin_profile.get("bio", "Professional Web Developer & Designer"),
            "linkedin": admin_profile.get("linkedin", "https://linkedin.com/in/mmb"),
            "github": admin_profile.get("github", "https://github.com/mmb"),
            "twitter": admin_profile.get("twitter", "https://twitter.com/mmb"),
            "instagram": admin_profile.get("instagram", "https://instagram.com/mmb"),
            "website": admin_profile.get("website", "https://mmb.dev")
        }
        
        success, result = self.make_request("PUT", "/admin/profile", update_data, auth_required=True)
        if not success or result["status_code"] != 200:
            self.log_test("PUT Admin Profile Update", False, f"Failed to update profile: {result.get('status_code', 'unknown')}", result)
            return False
        
        updated_admin_profile = result["response"]
        self.log_test("PUT Admin Profile Update", True, f"Profile updated successfully with new phone: {updated_admin_profile.get('phone', '')}")
        
        # Step 4: Verify updated data in admin profile endpoint
        success, result = self.make_request("GET", "/admin/profile", auth_required=True)
        if not success or result["status_code"] != 200:
            self.log_test("GET Admin Profile (Verify)", False, f"Failed to verify admin profile: {result.get('status_code', 'unknown')}", result)
            return False
        
        verified_admin_profile = result["response"]
        admin_phone_updated = verified_admin_profile.get("phone") == new_phone
        if admin_phone_updated:
            self.log_test("Admin Profile Persistence", True, f"Admin profile phone correctly updated to: {verified_admin_profile.get('phone')}")
        else:
            self.log_test("Admin Profile Persistence", False, f"Admin profile phone not updated. Expected: {new_phone}, Got: {verified_admin_profile.get('phone')}")
        
        # Step 5: Verify updated data in public profile endpoint
        success, result = self.make_request("GET", "/profile")
        if not success or result["status_code"] != 200:
            self.log_test("GET Public Profile (Verify)", False, f"Failed to verify public profile: {result.get('status_code', 'unknown')}", result)
            return False
        
        verified_public_profile = result["response"]
        public_phone_updated = verified_public_profile.get("phone") == new_phone
        if public_phone_updated:
            self.log_test("Public Profile Persistence", True, f"Public profile phone correctly updated to: {verified_public_profile.get('phone')}")
        else:
            self.log_test("Public Profile Persistence", False, f"Public profile phone not updated. Expected: {new_phone}, Got: {verified_public_profile.get('phone')}")
        
        # Step 6: Verify WhatsApp number also updated
        whatsapp_updated = verified_public_profile.get("whatsapp") == new_phone
        if whatsapp_updated:
            self.log_test("WhatsApp Number Update", True, f"WhatsApp number correctly updated to: {verified_public_profile.get('whatsapp')}")
        else:
            self.log_test("WhatsApp Number Update", False, f"WhatsApp number not updated. Expected: {new_phone}, Got: {verified_public_profile.get('whatsapp')}")
        
        # Overall flow success
        flow_success = admin_phone_updated and public_phone_updated and whatsapp_updated
        if flow_success:
            self.log_test("Profile Update Flow Complete", True, "End-to-end profile update flow successful - changes persist across all endpoints")
        else:
            self.log_test("Profile Update Flow Complete", False, "Profile update flow failed - changes not persisting properly")
        
        return flow_success
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print(f"🚀 Starting Backend API Tests for: {self.base_url}")
        print("=" * 60)
        
        # Test admin authentication first
        if not self.test_admin_login():
            print("\n❌ CRITICAL: Admin login failed. Cannot proceed with authenticated tests.")
            return False
        
        # Test admin token verification
        self.test_admin_verify()
        
        # Test profile update flow (PRIORITY TEST)
        self.test_profile_update_flow()
        
        # Test CRUD operations
        self.test_services_crud()
        self.test_projects_crud()
        
        # Test contact management
        self.test_contacts_management()
        
        # Test public APIs
        self.test_public_apis()
        
        # Summary
        self.print_summary()
        return True
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)

def main():
    """Main function to run tests"""
    tester = APITester()
    success = tester.run_all_tests()
    
    if not success:
        sys.exit(1)
    
    # Check if any critical tests failed
    critical_failures = [
        result for result in tester.test_results 
        if not result["success"] and any(keyword in result["test"].lower() 
        for keyword in ["login", "admin", "services", "projects", "contact"])
    ]
    
    if critical_failures:
        print(f"\n⚠️  {len(critical_failures)} critical test(s) failed!")
        sys.exit(1)
    else:
        print("\n🎉 All critical tests passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()