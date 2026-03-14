'use client'

import { User, Bell, Shield, Palette, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-600">Manage your account and application preferences</p>
      </div>

      <div className="max-w-4xl">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-neutral-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="your@email.com"
              />
            </div>
            <Button className="bg-teal-600 hover:bg-teal-700">Save Profile</Button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-neutral-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Notifications</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-teal-600" />
              <span className="text-neutral-700">Email notifications for new interviews</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-teal-600" />
              <span className="text-neutral-700">Weekly job search summary</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-teal-600" />
              <span className="text-neutral-700">Application status changes</span>
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-neutral-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Privacy</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-teal-600" />
              <span className="text-neutral-700">Make profile private</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-teal-600" />
              <span className="text-neutral-700">Hide salary information</span>
            </label>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-neutral-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Theme</label>
              <select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-neutral-600" />
            <h2 className="text-xl font-semibold text-neutral-900">Help & Support</h2>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              View Documentation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
