import { User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

export function Settings() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-neutral-900 mb-3">
          <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-lg text-neutral-600">Manage your account and preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="max-w-4xl space-y-8">
        {/* Profile Settings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-neutral-200/50 flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-white">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Profile</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" className="h-12 rounded-2xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" className="h-12 rounded-2xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" className="h-12 rounded-2xl" />
            </div>
            <div className="flex justify-end">
              <Button className="rounded-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30 px-8 font-bold">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-neutral-200/50 flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-white">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Notifications</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-neutral-50 transition-colors">
              <div>
                <p className="font-bold text-neutral-900">Interview Reminders</p>
                <p className="text-sm text-neutral-600 mt-1">Get notified about upcoming interviews</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-neutral-50 transition-colors">
              <div>
                <p className="font-bold text-neutral-900">Application Updates</p>
                <p className="text-sm text-neutral-600 mt-1">Receive updates on application status changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-neutral-50 transition-colors">
              <div>
                <p className="font-bold text-neutral-900">Weekly Summary</p>
                <p className="text-sm text-neutral-600 mt-1">Get a weekly summary of your applications</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-neutral-200/50 flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-white">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Appearance</h2>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <Label className="mb-4 block text-base font-bold">Theme</Label>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-6 border-4 border-teal-500 rounded-2xl bg-white hover:bg-neutral-50 transition-all shadow-lg hover:shadow-xl">
                  <div className="w-full h-16 bg-white border-2 border-neutral-200 rounded-xl mb-3"></div>
                  <p className="font-bold text-neutral-900">Light</p>
                </button>
                <button className="p-6 border-4 border-transparent rounded-2xl bg-white hover:bg-neutral-50 transition-all hover:shadow-lg">
                  <div className="w-full h-16 bg-neutral-900 rounded-xl mb-3"></div>
                  <p className="font-bold text-neutral-600">Dark</p>
                </button>
                <button className="p-6 border-4 border-transparent rounded-2xl bg-white hover:bg-neutral-50 transition-all hover:shadow-lg">
                  <div className="w-full h-16 bg-gradient-to-r from-white via-neutral-400 to-neutral-900 rounded-xl mb-3"></div>
                  <p className="font-bold text-neutral-600">Auto</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-neutral-200/50 flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-white">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Privacy & Security</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" className="h-12 rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" className="h-12 rounded-2xl" />
            </div>
            <div className="flex justify-end">
              <Button className="rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30 px-8 font-bold">
                Update Password
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl border-2 border-red-200 overflow-hidden shadow-xl">
          <div className="px-8 py-6 border-b border-red-200 bg-red-100/50">
            <h2 className="text-xl font-bold text-red-900">Danger Zone</h2>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-red-900 text-lg">Delete Account</p>
                <p className="text-sm text-red-700 mt-1">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" className="rounded-full font-bold px-8 shadow-lg shadow-red-500/30">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}