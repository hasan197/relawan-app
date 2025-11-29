import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { FileUpload } from '../components/ui/file-upload';
import { useDonations } from '../hooks/useDonations';
import { useAppContext } from '../contexts/AppContext';
import { toast } from 'sonner';

export function DonationFormExample() {
  const { user } = useAppContext();
  const { addDonationWithFile, fileUploading, uploadProgress } = useDonations(user?.id || null);
  
  const [formData, setFormData] = useState({
    donor_id: '',
    amount: '',
    category: 'zakat' as const,
    notes: '',
    payment_method: 'transfer' as const,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      await addDonationWithFile(
        {
          donor_id: formData.donor_id || undefined,
          amount: parseFloat(formData.amount),
          category: formData.category,
          notes: formData.notes,
          payment_method: formData.payment_method,
          relawan_name: user.fullName,
        },
        selectedFile || undefined
      );

      toast.success('Donation added successfully!');
      
      // Reset form
      setFormData({
        donor_id: '',
        amount: '',
        category: 'zakat',
        notes: '',
        payment_method: 'transfer',
      });
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add donation');
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Donation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Donor ID
          </label>
          <Input
            value={formData.donor_id}
            onChange={(e) => setFormData(prev => ({ ...prev, donor_id: e.target.value }))}
            placeholder="Enter donor ID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (IDR)
          </label>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="Enter amount"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="zakat">Zakat</option>
            <option value="infaq">Infaq</option>
            <option value="sedekah">Sedekah</option>
            <option value="wakaf">Wakaf</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            value={formData.payment_method}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({ ...prev, payment_method: e.target.value as any }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="transfer">Transfer</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transfer Proof (Optional)
          </label>
          <FileUpload
            onFileSelect={handleFileSelect}
            uploading={fileUploading}
            uploadProgress={uploadProgress}
            currentFile={selectedFile ? selectedFile.name : null}
            onRemoveFile={handleRemoveFile}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Add any notes..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <Button
          type="submit"
          disabled={fileUploading || !formData.donor_id || !formData.amount}
          className="w-full"
        >
          {fileUploading ? 'Uploading...' : 'Add Donation'}
        </Button>
      </form>
    </Card>
  );
}
