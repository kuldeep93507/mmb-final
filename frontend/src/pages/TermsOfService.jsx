import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useProfile } from '../context/ProfileContext';

const TermsOfService = () => {
  const navigate = useNavigate();
  const { profile, loading } = useProfile();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last updated: January 2024</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the services provided by MMB (Modern Web Solutions), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Services Provided</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MMB provides professional web development services including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Website Development and Design</li>
              <li>Landing Page Creation</li>
              <li>UX/UI Design Services</li>
              <li>WordPress Development</li>
              <li>Web Application Development</li>
              <li>Maintenance and Support Services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Project Scope</h3>
                <p className="text-gray-700 leading-relaxed">
                  All projects will be clearly defined in a separate project agreement or proposal. The scope includes specific deliverables, timeline, and requirements as agreed upon by both parties.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Payment Terms</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>50% advance payment required to start the project</li>
                  <li>Remaining 50% due upon project completion</li>
                  <li>All payments are non-refundable once work has commenced</li>
                  <li>Late payment may result in project delays or suspension</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Timeline</h3>
                <p className="text-gray-700 leading-relaxed">
                  Project timelines are estimates and may vary based on project complexity, client feedback response time, and scope changes. We strive to meet all agreed deadlines but cannot guarantee delivery dates.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Client Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The client agrees to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide all necessary content, materials, and information in a timely manner</li>
              <li>Respond to requests for feedback and approval within agreed timeframes</li>
              <li>Make payments according to the agreed schedule</li>
              <li>Provide accurate and complete project requirements</li>
              <li>Test and approve all deliverables before final acceptance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Client Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  All content, text, images, and materials provided by the client remain the property of the client. The client grants MMB a license to use these materials for the duration of the project.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Developed Work</h3>
                <p className="text-gray-700 leading-relaxed">
                  Upon full payment, the client will own the final delivered website/application. MMB retains the right to use the project for portfolio purposes and case studies.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Revisions and Changes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Project packages include a specified number of revisions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Minor revisions: Text changes, color adjustments, small layout modifications</li>
              <li>Major revisions: Significant design changes, additional features, scope expansion</li>
              <li>Additional revisions beyond the agreed limit will incur extra charges</li>
              <li>Scope changes may affect timeline and pricing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Warranties and Disclaimers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Service Warranty</h3>
                <p className="text-gray-700 leading-relaxed">
                  We warrant that our services will be performed in a professional manner. We provide 30 days of free bug fixes after project completion for issues related to our development work.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  MMB's liability is limited to the amount paid for the specific service. We are not liable for any indirect, incidental, or consequential damages.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cancellation and Refunds</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Client may cancel the project with 48 hours written notice</li>
              <li>Cancellation fees may apply based on work completed</li>
              <li>Advance payments are non-refundable once work has commenced</li>
              <li>Completed work and files will be delivered upon cancellation payment settlement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Maintenance and Support</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Post-launch support options include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>30 days free bug fixes and minor adjustments</li>
              <li>Ongoing maintenance packages available separately</li>
              <li>Content updates and feature additions quoted separately</li>
              <li>Emergency support available with additional charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed">
              Either party may terminate this agreement with written notice. Upon termination, the client will pay for all work completed to date, and MMB will deliver all completed work files.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions regarding these Terms of Service, please contact us at:
            </p>
            {loading ? (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800 font-medium">{profile?.name || 'MMB'} - Modern Web Solutions</p>
                <p className="text-gray-700">Email: {profile?.email || 'hello@mmb.dev'}</p>
                <p className="text-gray-700">Phone: {profile?.phone || '+91 98765 43210'}</p>
                {profile?.address && (
                  <p className="text-gray-700">Address: {profile.address}</p>
                )}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;