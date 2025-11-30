import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Users, UserCog, Target, TrendingUp, Layers, MessageSquare, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import { useAdminData } from '../../hooks/useAdminData';
import { LoadingSpinner } from '../../components/LoadingState';
import { apiCall } from '../../lib/supabase';

interface DesktopAdminDataManagementPageProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

type TabType = 'users' | 'regu' | 'muzakki' | 'donasi' | 'program' | 'template';

export function DesktopAdminDataManagementPage({ onBack, onNavigate }: DesktopAdminDataManagementPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use custom hook
  const { data, loading, fetchData, createItem, updateItem, deleteItem } = useAdminData(activeTab);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Dropdown data
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const tabs = [
    { id: 'users' as TabType, label: 'Users', icon: Users, color: 'blue' },
    { id: 'regu' as TabType, label: 'Regu', icon: UserCog, color: 'purple' },
    { id: 'muzakki' as TabType, label: 'Muzakki', icon: Target, color: 'green' },
    { id: 'donasi' as TabType, label: 'Donasi', icon: TrendingUp, color: 'yellow' },
    { id: 'program' as TabType, label: 'Program', icon: Layers, color: 'indigo' },
    { id: 'template' as TabType, label: 'Template', icon: MessageSquare, color: 'pink' },
  ];

  // Utility function to remove null/undefined values
  const removeNullValues = (obj: any): any => {
    const cleaned = { ...obj };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === null || cleaned[key] === undefined) {
        delete cleaned[key];
      }
    });
    return cleaned;
  };

  // Filter update data based on active tab to only send allowed fields
  const filterUpdateData = (tab: TabType, data: any): any => {
    switch (tab) {
      case 'users':
        // Only allow fields that are in Convex updateUser validator
        return removeNullValues({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          role: data.role,
          regu_id: data.regu_id
        });
      
      case 'regu':
        // Filter regu fields
        return removeNullValues({
          name: data.name,
          pembimbing_id: data.pembimbing_id, // Use consistent pembimbing_id field
          target: data.target,
          description: data.description
        });
      
      case 'muzakki':
        // Filter muzakki fields
        return removeNullValues({
          name: data.name,
          phone: data.phone,
          email: data.email,
          address: data.address,
          category: data.category,
          relawan_id: data.relawan_id
        });
      
      case 'donasi':
        // Filter donation fields
        return removeNullValues({
          donorName: data.donorName,
          amount: data.amount,
          category: data.category,
          relawan_id: data.relawan_id, // Use consistent relawan_id field
          notes: data.notes,
          paymentMethod: data.paymentMethod,
          receiptNumber: data.receiptNumber
        });
      
      case 'program':
        // Filter program fields - match Convex adminUpdate validator
        const programData = {
          title: data.name || data.title, // Try both 'name' and 'title' from frontend
          description: data.description,
          category: data.category,
          target_amount: data.target_amount,
          status: data.is_active ? "active" : "inactive", // Frontend uses boolean, Convex uses string
          start_date: data.start_date,
          end_date: data.end_date,
          image_url: data.image_url,
          collected_amount: data.collected_amount
        };
        // Remove null/undefined values to avoid Convex validation errors
        return removeNullValues(programData);
      
      case 'template':
        // Filter template fields
        return removeNullValues({
          name: data.name,
          category: data.category,
          message: data.message,
          title: data.title
        });
      
      default:
        // For other tabs, return minimal data
        return {};
    }
  };

  // Load data when tab changes
  useEffect(() => {
    fetchData();
  }, [activeTab, fetchData]);

  // Load users for dropdowns
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await apiCall('/admin/users');
      if (response.success) {
        setAllUsers(response.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOpenForm = (item?: any) => {
    if (item) {
      setEditingItem(item);
      
      // Transform database format to form format
      let transformedItem = { ...item };
      
      // Convert timestamp dates to string dates for form
      if (activeTab === 'program') {
        transformedItem = {
          ...item,
          title: item.title, // Use consistent 'title' field
          start_date: item.start_date ? new Date(item.start_date).toISOString().split('T')[0] : '',
          end_date: item.end_date ? new Date(item.end_date).toISOString().split('T')[0] : '',
          target_amount: item.target_amount,
          is_active: item.is_active,
          image_url: item.image_url
        };
      } else if (activeTab === 'muzakki') {
        // Transform relawanId to relawan_id for form consistency
        transformedItem = {
          ...item,
          relawan_id: item.relawanId || item.createdBy, // Map relawanId to relawan_id
        };
      } else if (activeTab === 'donasi') {
        // Transform relawanId to relawan_id for form consistency
        transformedItem = {
          ...item,
          relawan_id: item.relawanId, // Map relawanId to relawan_id
        };
      } else if (activeTab === 'regu') {
        // Transform pembimbingId to pembimbing_id for form consistency
        transformedItem = {
          ...item,
          pembimbing_id: item.pembimbingId, // Map pembimbingId to pembimbing_id
        };
      }
      
      setFormData(transformedItem);
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setShowFormModal(true);
    
    // Load users for dropdown when opening form
    if (['regu', 'muzakki', 'donasi'].includes(activeTab)) {
      loadUsers();
    }
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let success = false;
      
      if (editingItem) {
        // Update - filter only allowed fields and remove IDs
        const { id, _id, ...updateData } = formData;
        const itemId = editingItem._id || editingItem.id; // Use Convex _id or fallback to id
        
        // Filter only allowed fields based on activeTab
        const filteredUpdateData = filterUpdateData(activeTab, updateData);
        
        success = await updateItem(itemId, filteredUpdateData);
        if (success) {
          toast.success('Data berhasil diupdate');
          handleCloseForm();
          fetchData();
        } else {
          toast.error('Gagal mengupdate data');
        }
      } else {
        // Create - remove ID if exists
        const { id, ...createData } = formData;
        
        success = await createItem(createData);
        if (success) {
          toast.success('Data berhasil ditambahkan');
          handleCloseForm();
          fetchData();
        } else {
          toast.error('Gagal menambahkan data');
        }
      }
    } catch (error: any) {
      console.error('❌ Submit error:', error);
      toast.error(error.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSubmitting(true);
    try {
      const success = await deleteItem(deleteTarget.id);
      
      if (success) {
        toast.success('Data berhasil dihapus');
        setShowDeleteModal(false);
        setDeleteTarget(null);
        fetchData();
      } else {
        toast.error('Gagal menghapus data');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus data');
    } finally {
      setSubmitting(false);
    }
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'users':
        return (
          <>
            <div>
              <Label>Nama Lengkap *</Label>
              <Input
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <Label>No. Telepon *</Label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label>Role *</Label>
              <Select value={formData.role || 'relawan'} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relawan">Relawan</SelectItem>
                  <SelectItem value="pembimbing">Pembimbing</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'regu':
        const pembimbingList = allUsers.filter(u => u.role === 'pembimbing');
        return (
          <>
            <div>
              <Label>Nama Regu *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama regu"
                required
              />
            </div>
            <div>
              <Label>Pembimbing *</Label>
              <Select 
                value={formData.pembimbing_id || ''} 
                onValueChange={(v) => setFormData({ ...formData, pembimbing_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pembimbing" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>Memuat...</SelectItem>
                  ) : pembimbingList.length === 0 ? (
                    <SelectItem value="empty" disabled>Tidak ada pembimbing</SelectItem>
                  ) : (
                    pembimbingList.map(user => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.fullName || user.name} - {user.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target (Rp)</Label>
              <Input
                type="number"
                value={formData.target || 0}
                onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </>
        );

      case 'muzakki':
        return (
          <>
            <div>
              <Label>Nama *</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Masukkan nama muzakki"
              />
            </div>
            <div>
              <Label>No. Telepon *</Label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <Label>Alamat</Label>
              <Textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Masukkan alamat"
                rows={2}
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={formData.category || 'muzakki'} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="muzakki">Muzakki</SelectItem>
                  <SelectItem value="donatur">Donatur</SelectItem>
                  <SelectItem value="prospek">Prospek</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relawan *</Label>
              <Select 
                value={formData.relawan_id || ''} 
                onValueChange={(v) => setFormData({ ...formData, relawan_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih relawan" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>Memuat...</SelectItem>
                  ) : allUsers.filter(u => u.role === 'relawan' || u.role === 'pembimbing').length === 0 ? (
                    <SelectItem value="empty" disabled>Tidak ada relawan</SelectItem>
                  ) : (
                    allUsers.filter(u => u.role === 'relawan' || u.role === 'pembimbing').map(user => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.fullName || user.name} - {user.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'donasi':
        return (
          <>
            <div>
              <Label>Nama Donor *</Label>
              <Input
                value={formData.donor_name || ''}
                onChange={(e) => setFormData({ ...formData, donor_name: e.target.value })}
                placeholder="Masukkan nama donor"
              />
            </div>
            <div>
              <Label>Jumlah (Rp) *</Label>
              <Input
                type="number"
                value={formData.amount || 0}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Select value={formData.category || 'zakat'} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zakat">Zakat</SelectItem>
                  <SelectItem value="infaq">Infaq</SelectItem>
                  <SelectItem value="sedekah">Sedekah</SelectItem>
                  <SelectItem value="wakaf">Wakaf</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Relawan *</Label>
              <Select 
                value={formData.relawan_id || ''} 
                onValueChange={(v) => setFormData({ ...formData, relawan_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih relawan" />
                </SelectTrigger>
                <SelectContent>
                  {loadingUsers ? (
                    <SelectItem value="loading" disabled>Memuat...</SelectItem>
                  ) : allUsers.filter(u => u.role === 'relawan' || u.role === 'pembimbing').length === 0 ? (
                    <SelectItem value="empty" disabled>Tidak ada relawan</SelectItem>
                  ) : (
                    allUsers.filter(u => u.role === 'relawan' || u.role === 'pembimbing').map(user => (
                      <SelectItem key={user._id || user.id} value={user._id || user.id}>
                        {user.fullName || user.name} - {user.phone}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status || 'pending'} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'program':
        return (
          <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
            {/* Left Panel - Form Fields */}
            <div className="lg:w-1/2 space-y-4 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">📝 Informasi Program</h4>
                <p className="text-xs text-blue-700">Lengkapi detail program ZISWAF untuk memudahkan relawan dalam fundraising</p>
              </div>

              <div>
                <Label>Judul Program *</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Wakaf Sumur untuk Yaman"
                  className="text-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kategori *</Label>
                  <Select value={formData.category || 'zakat'} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zakat">🕌 Zakat</SelectItem>
                      <SelectItem value="infaq">💰 Infaq</SelectItem>
                      <SelectItem value="sedekah">🤲 Sedekah</SelectItem>
                      <SelectItem value="wakaf">🏛️ Wakaf</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target Dana (Rp) *</Label>
                  <Input
                    type="number"
                    value={formData.target_amount || 0}
                    onChange={(e) => setFormData({ ...formData, target_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="10000000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Deskripsi Program *</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan tujuan dan manfaat program ini secara detail...&#10;&#10;Contoh:&#10;Program ini bertujuan untuk membangun sumur air bersih di wilayah Yaman yang mengalami krisis air. Setiap sumur dapat melayani 200+ keluarga dan menjadi amal jariyah yang terus mengalir pahalanya."
                  rows={8}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description?.length || 0} karakter
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Tanggal Berakhir</Label>
                  <Input
                    type="date"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status Program</Label>
                  <Select value={formData.status || 'active'} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">✅ Aktif</SelectItem>
                      <SelectItem value="inactive">⏸️ Tidak Aktif</SelectItem>
                      <SelectItem value="completed">🎯 Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Progress Saat Ini</Label>
                  <Input
                    type="number"
                    value={formData.collected_amount || 0}
                    onChange={(e) => setFormData({ ...formData, collected_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label>URL Gambar/Banner</Label>
                <Input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/gambar.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Link gambar untuk banner program (opsional)</p>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:w-1/2 lg:border-l lg:pl-6 overflow-y-auto">
              <div className="sticky top-0">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">👁️ Preview Program</h4>
                  <p className="text-xs text-gray-600">Tampilan program seperti yang dilihat relawan</p>
                </div>

                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                  {/* Banner */}
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Banner" className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">
                          {formData.category === 'zakat' ? '🕌' :
                           formData.category === 'infaq' ? '💰' :
                           formData.category === 'sedekah' ? '🤲' : '🏛️'}
                        </div>
                        <p className="text-sm text-gray-500">Banner Program</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Category Badge */}
                    <div className="flex gap-2 mb-3">
                      <Badge className="bg-green-100 text-green-700">
                        {formData.category || 'Kategori'}
                      </Badge>
                      <Badge className={
                        formData.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        formData.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {formData.status === 'active' ? 'Aktif' :
                         formData.status === 'completed' ? 'Selesai' : 'Tidak Aktif'}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-gray-900 text-xl mb-3">
                      {formData.title || 'Judul Program'}
                    </h3>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Terkumpul</span>
                        <span className="text-gray-900 font-semibold">
                          {formatCurrency(formData.collected_amount || 0)} / {formatCurrency(formData.target_amount || 0)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(((formData.collected_amount || 0) / (formData.target_amount || 1)) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(((formData.collected_amount || 0) / (formData.target_amount || 1)) * 100)}% tercapai
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h4>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {formData.description || 'Deskripsi program akan muncul di sini...'}
                      </p>
                    </div>

                    {/* Date Range */}
                    {(formData.start_date || formData.end_date) && (
                      <div className="flex gap-4 text-sm text-gray-600 pt-4 border-t">
                        {formData.start_date && (
                          <div>
                            <span className="text-gray-500">Mulai:</span> {new Date(formData.start_date).toLocaleDateString('id-ID')}
                          </div>
                        )}
                        {formData.end_date && (
                          <div>
                            <span className="text-gray-500">Berakhir:</span> {new Date(formData.end_date).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'template':
        const previewMessage = formData.message
          ?.replace(/{nama}/g, 'Bapak Ahmad Fadli')
          ?.replace(/{jumlah}/g, 'Rp 1.000.000')
          ?.replace(/{program}/g, 'Wakaf Sumur untuk Yaman')
          ?.replace(/{tanggal}/g, new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
          ?.replace(/{relawan}/g, 'Siti Nurhaliza')
          || 'Preview akan muncul di sini...';

        return (
          <div className="h-full flex flex-col lg:flex-row gap-6 p-6">
            {/* Left Panel - Editor */}
            <div className="lg:w-1/2 space-y-4 overflow-y-auto">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-pink-900 mb-2">💬 Template WhatsApp Editor</h4>
                <p className="text-xs text-pink-700">Buat template pesan yang dapat digunakan relawan untuk komunikasi dengan muzakki</p>
              </div>

              <div>
                <Label>Nama Template *</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Template Ucapan Terima Kasih Donasi"
                  className="text-lg"
                  required
                />
              </div>

              <div>
                <Label>Kategori *</Label>
                <Select value={formData.category || 'general'} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greeting">👋 Salam Pembuka</SelectItem>
                    <SelectItem value="reminder">⏰ Pengingat</SelectItem>
                    <SelectItem value="thanks">🙏 Ucapan Terima Kasih</SelectItem>
                    <SelectItem value="invitation">📨 Undangan/Ajakan</SelectItem>
                    <SelectItem value="follow-up">🔄 Follow Up</SelectItem>
                    <SelectItem value="info">ℹ️ Informasi Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Pesan Template *</Label>
                  <span className="text-xs text-gray-500">
                    {formData.message?.length || 0} karakter
                  </span>
                </div>
                
                {/* Quick Insert Toolbar */}
                <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700 mb-2 font-semibold">💡 Quick Insert Placeholder:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: '{nama}', label: '👤 Nama', desc: 'Nama muzakki' },
                      { key: '{jumlah}', label: '💰 Jumlah', desc: 'Nominal donasi' },
                      { key: '{program}', label: '📋 Program', desc: 'Nama program' },
                      { key: '{tanggal}', label: '📅 Tanggal', desc: 'Tanggal hari ini' },
                      { key: '{relawan}', label: '🙋 Relawan', desc: 'Nama relawan' }
                    ].map(({ key, label, desc }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('template-message-editor-desktop') as HTMLTextAreaElement;
                          if (textarea) {
                            const cursorPos = textarea.selectionStart;
                            const textBefore = formData.message?.substring(0, cursorPos) || '';
                            const textAfter = formData.message?.substring(cursorPos) || '';
                            const newMessage = textBefore + key + textAfter;
                            setFormData({ ...formData, message: newMessage });
                            
                            // Refocus and set cursor after inserted text
                            setTimeout(() => {
                              textarea.focus();
                              textarea.setSelectionRange(cursorPos + key.length, cursorPos + key.length);
                            }, 0);
                          }
                        }}
                        className="px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-all shadow-sm"
                        title={desc}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  id="template-message-editor-desktop"
                  value={formData.message || ''}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Contoh:&#10;&#10;Assalamualaikum Warahmatullahi Wabarakatuh {nama},&#10;&#10;Jazakallah khair atas donasi Anda sebesar {jumlah} untuk program {program}.&#10;&#10;Semoga menjadi amal jariyah yang berkah dan memberikan keberkahan di dunia dan akhirat. 🤲&#10;&#10;Hormat kami,&#10;{relawan}&#10;Relawan ZISWAF"
                  rows={12}
                  className="resize-none font-mono text-sm"
                  required
                />
              </div>

              {/* Template Examples */}
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">📝 Contoh Template Populer:</p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      message: 'Assalamualaikum {nama},\n\nJazakallah khair atas donasi sebesar {jumlah} untuk {program}. Semoga menjadi amal jariyah yang berkah. 🤲\n\nSalam,\n{relawan}'
                    })}
                    className="w-full text-left px-3 py-2 bg-white border rounded text-xs hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-700">Terima Kasih Donasi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      message: 'Assalamualaikum {nama},\n\nKami ingin mengingatkan tentang program {program} yang masih berjalan. Mari berbagi kebaikan bersama! 💚\n\nInfo: {relawan}\n{tanggal}'
                    })}
                    className="w-full text-left px-3 py-2 bg-white border rounded text-xs hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-700">Pengingat Program</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="lg:w-1/2 lg:border-l lg:pl-6 overflow-y-auto">
              <div className="sticky top-0">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">👁️ Live Preview</h4>
                  <p className="text-xs text-gray-600">Tampilan pesan WhatsApp seperti yang diterima muzakki</p>
                </div>

                {/* WhatsApp Preview */}
                <div className="bg-gradient-to-b from-[#075E54] to-[#128C7E] p-4 rounded-t-2xl">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Relawan ZISWAF</h4>
                      <p className="text-xs opacity-90">Online</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#E5DDD5] p-4 rounded-b-2xl min-h-[400px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxyZWN0IGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1IiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]">
                  {/* Message Bubble */}
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[85%]">
                      {/* Template Name Tag */}
                      {formData.name && (
                        <div className="text-right mb-1">
                          <span className="inline-block px-2 py-1 bg-white/60 rounded text-xs text-gray-600">
                            📋 {formData.name}
                          </span>
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 shadow-sm">
                        <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {previewMessage}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2">ℹ️ Informasi Template</h5>
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Kategori:</span>
                        <span className="font-semibold text-pink-600">
                          {formData.category === 'greeting' ? '👋 Salam Pembuka' :
                           formData.category === 'reminder' ? '⏰ Pengingat' :
                           formData.category === 'thanks' ? '🙏 Terima Kasih' :
                           formData.category === 'invitation' ? '📨 Undangan' :
                           formData.category === 'follow-up' ? '🔄 Follow Up' :
                           formData.category === 'info' ? 'ℹ️ Informasi' : 'Umum'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Panjang pesan:</span>
                        <span className="font-semibold">{formData.message?.length || 0} karakter</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Placeholder digunakan:</span>
                        <span className="font-semibold">
                          {(formData.message?.match(/{[^}]+}/g) || []).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner message="Memuat data..." />;
    }

    const filtered = data.filter((item: any) => {
      const query = searchQuery.toLowerCase();
      return (
        (item.name?.toLowerCase() || '').includes(query) ||
        (item.full_name?.toLowerCase() || '').includes(query) ||
        (item.title?.toLowerCase() || '').includes(query) ||
        (item.donor_name?.toLowerCase() || '').includes(query) ||
        (item.phone || '').includes(query) ||
        (item.email?.toLowerCase() || '').includes(query)
      );
    });

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada data</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item: any) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {activeTab === 'users' && (
                  <>
                    <h3 className="text-gray-900 mb-1">{item.fullName || item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.phone}</p>
                    <Badge className={
                      item.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      item.role === 'pembimbing' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }>
                      {item.role}
                    </Badge>
                  </>
                )}
                {activeTab === 'regu' && (
                  <>
                    <h3 className="text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">Pembimbing: {item.pembimbing_name}</p>
                    <p className="text-gray-600 text-sm">Target: {formatCurrency(item.target)}</p>
                  </>
                )}
                {activeTab === 'muzakki' && (
                  <>
                    <h3 className="text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">{item.phone}</p>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-1">{item.address}</p>
                    <Badge className="bg-green-100 text-green-700">{item.category}</Badge>
                  </>
                )}
                {activeTab === 'donasi' && (
                  <>
                    <h3 className="text-gray-900 mb-1">{item.donor_name}</h3>
                    <p className="text-primary-600 font-semibold mb-2">{formatCurrency(item.amount)}</p>
                    <div className="flex gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-700">{item.category}</Badge>
                      <Badge className={
                        item.status === 'verified' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  </>
                )}
                {activeTab === 'program' && (
                  <>
                    <h3 className="text-gray-900 mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                    )}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 text-xs">
                          {formatCurrency(item.collected_amount || 0)} / {formatCurrency(item.target_amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full"
                          style={{ width: `${Math.min(((item.collected_amount || 0) / item.target_amount) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className="bg-green-100 text-green-700">{item.category}</Badge>
                      <Badge className={
                        item.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {item.status === 'active' ? 'Aktif' : item.status === 'completed' ? 'Selesai' : 'Tidak Aktif'}
                      </Badge>
                    </div>
                  </>
                )}
                {activeTab === 'template' && (
                  <>
                    <h3 className="text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-3">{item.message}</p>
                    <Badge className="bg-pink-100 text-pink-700">
                      {item.category === 'greeting' ? 'Salam Pembuka' :
                       item.category === 'reminder' ? 'Pengingat' :
                       item.category === 'thanks' ? 'Terima Kasih' :
                       item.category === 'invitation' ? 'Undangan' :
                       item.category === 'follow-up' ? 'Follow Up' :
                       item.category === 'info' ? 'Informasi' : item.category}
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => handleOpenForm(item)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Edit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget(item);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="mb-4">
            <h1 className="text-gray-900 text-2xl">Data Management</h1>
            <p className="text-gray-600 text-sm">Kelola semua data sistem</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Actions */}
          <div className="flex gap-3">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => handleOpenForm()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Data
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl w-full flex flex-col ${
            activeTab === 'program' || activeTab === 'template' 
              ? 'max-w-7xl h-[95vh]' 
              : 'max-w-2xl max-h-[90vh]'
          }`}>
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Header - Fixed */}
              <div className="flex items-center justify-between p-6 pb-4 border-b">
                <div>
                  <h3 className="text-gray-900 text-xl">
                    {editingItem ? 'Edit Data' : 'Tambah Data'}
                  </h3>
                  {(activeTab === 'program' || activeTab === 'template') && (
                    <p className="text-sm text-gray-500 mt-1">
                      {activeTab === 'program' ? 'Content Editor - Program ZISWAF' : 'Content Editor - Template WhatsApp'}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Form Fields - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                {(activeTab === 'program' || activeTab === 'template') ? (
                  <div className="h-full">
                    {renderFormFields()}
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {renderFormFields()}
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons - Fixed */}
              <div className="flex gap-3 p-6 pt-4 border-t bg-white">
                <Button
                  type="button"
                  onClick={handleCloseForm}
                  variant="outline"
                  className="flex-1"
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 text-xl">Konfirmasi Hapus</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeleteModal(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={submitting}
                >
                  {submitting ? 'Menghapus...' : 'Hapus'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
