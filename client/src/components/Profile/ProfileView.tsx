import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileViewProps {
  onBack: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack }) => {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences, getDisplayName, getInitials } = useUser();
  const { toast } = useToast();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const mockStats = {
    studentsCount: 124,
    classesCount: 6,
    yearsExp: 8,
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would update the user profile in Firebase
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditProfileOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    updatePreferences({ [key]: value });
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-medium" data-testid="text-user-initials">
              {getInitials()}
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1" data-testid="text-user-name">
            {getDisplayName()}
          </h2>
          <p className="text-gray-600 mb-2 capitalize" data-testid="text-user-role">
            {user?.role} {user?.role === 'teacher' ? '• Mathematics' : ''}
          </p>
          <p className="text-sm text-gray-500" data-testid="text-user-email">
            {user?.email}
          </p>
          
          <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900" data-testid="text-stats-students">
                {mockStats.studentsCount}
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900" data-testid="text-stats-classes">
                {mockStats.classesCount}
              </div>
              <div className="text-sm text-gray-600">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900" data-testid="text-stats-experience">
                {mockStats.yearsExp}
              </div>
              <div className="text-sm text-gray-600">Years</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              data-testid="button-view-schedule"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-primary">schedule</span>
                <span className="font-medium text-gray-900">View My Schedule</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              data-testid="button-manage-classes"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-success">class</span>
                <span className="font-medium text-gray-900">Manage Classes</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              data-testid="button-view-reports"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-warning">assessment</span>
                <span className="font-medium text-gray-900">Performance Reports</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setIsEditProfileOpen(true)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              data-testid="button-edit-profile"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">edit</span>
                <span className="font-medium text-gray-900">Edit Profile</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setIsNotificationsOpen(true)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              data-testid="button-notifications"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">notifications</span>
                <span className="font-medium text-gray-900">Notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {preferences.notifications ? 'On' : 'Off'}
                </span>
                <span className="material-icons text-gray-400">chevron_right</span>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              data-testid="button-privacy"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">security</span>
                <span className="font-medium text-gray-900">Privacy & Security</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              data-testid="button-help"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">help</span>
                <span className="font-medium text-gray-900">Help & Support</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
              data-testid="button-about"
            >
              <div className="flex items-center space-x-3">
                <span className="material-icons text-gray-600">info</span>
                <span className="font-medium text-gray-900">About EducTrack</span>
              </div>
              <span className="material-icons text-gray-400">chevron_right</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="bg-white rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full flex items-center justify-center space-x-3 p-3 bg-red-50 text-error rounded-xl hover:bg-red-100 transition-colors"
            data-testid="button-sign-out"
          >
            <span className="material-icons">logout</span>
            <span className="font-medium">Sign Out</span>
          </Button>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={editForm.firstName}
                onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={editForm.lastName}
                onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Preferences</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive notifications about important updates</p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.notifications}
                onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive email updates and summaries</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Mobile Notifications</Label>
                <p className="text-sm text-gray-600">Get notified on your mobile device</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
              />
            </div>

            <Button 
              onClick={() => setIsNotificationsOpen(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
