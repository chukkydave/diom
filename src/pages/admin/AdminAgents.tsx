import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useDeliveryAgents } from '@/hooks/useDeliveryAgents';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Bike,
  Car,
  Truck as TruckIcon,
} from 'lucide-react';
import { DeliveryAgent } from '@/types/admin';
import { format } from 'date-fns';
import { toast } from 'sonner';

const vehicleIcons = {
  motorcycle: Bike,
  car: Car,
  van: TruckIcon,
  truck: TruckIcon,
};

const AdminAgents = () => {
  const { agents, isLoading, createAgent, updateAgent, deleteAgent, toggleAvailability } = useDeliveryAgents();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: 'motorcycle' as DeliveryAgent['vehicleType'],
    vehiclePlate: '',
    maxDeliveries: 5,
    zone: '',
    isAvailable: true,
  });

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.zone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      vehicleType: 'motorcycle',
      vehiclePlate: '',
      maxDeliveries: 5,
      zone: '',
      isAvailable: true,
    });
  };

  const handleCreateAgent = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    createAgent(formData);
    toast.success('Delivery agent created successfully');
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditAgent = () => {
    if (!selectedAgent) return;

    updateAgent(selectedAgent.id, formData);
    toast.success('Agent updated successfully');
    setIsEditModalOpen(false);
    setSelectedAgent(null);
    resetForm();
  };

  const handleDeleteAgent = (agentId: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      deleteAgent(agentId);
      toast.success('Agent deleted successfully');
    }
  };

  const openEditModal = (agent: DeliveryAgent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      vehicleType: agent.vehicleType,
      vehiclePlate: agent.vehiclePlate || '',
      maxDeliveries: agent.maxDeliveries,
      zone: agent.zone || '',
      isAvailable: agent.isAvailable,
    });
    setIsEditModalOpen(true);
  };

  const AgentFormFields = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@diom.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+234 800 000 0000"
          />
        </div>
        <div>
          <Label htmlFor="zone">Zone/Area</Label>
          <Input
            id="zone"
            value={formData.zone}
            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            placeholder="Lagos Island"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <Select
            value={formData.vehicleType}
            onValueChange={(value: DeliveryAgent['vehicleType']) =>
              setFormData({ ...formData, vehicleType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="vehiclePlate">Vehicle Plate</Label>
          <Input
            id="vehiclePlate"
            value={formData.vehiclePlate}
            onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
            placeholder="LAG-123-AB"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxDeliveries">Max Deliveries/Day</Label>
          <Input
            id="maxDeliveries"
            type="number"
            min={1}
            max={20}
            value={formData.maxDeliveries}
            onChange={(e) => setFormData({ ...formData, maxDeliveries: parseInt(e.target.value) || 5 })}
          />
        </div>
        <div>
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={formData.isAvailable ? 'available' : 'unavailable'}
            onValueChange={(value) =>
              setFormData({ ...formData, isAvailable: value === 'available' })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl  font-bold">Delivery Agents</h1>
            <p className="text-muted-foreground">Manage your delivery fleet</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold">{agents.length}</p>
            <p className="text-sm text-muted-foreground">Total Agents</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold text-green-600">
              {agents.filter(a => a.isAvailable).length}
            </p>
            <p className="text-sm text-muted-foreground">Available</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold text-yellow-600">
              {agents.reduce((sum, a) => sum + a.currentDeliveries, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Active Deliveries</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-2xl font-bold text-blue-600">
              {agents.filter(a => a.vehicleType === 'motorcycle').length}
            </p>
            <p className="text-sm text-muted-foreground">Motorcycles</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Deliveries</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => {
                const VehicleIcon = vehicleIcons[agent.vehicleType];
                return (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Since {format(new Date(agent.createdAt), 'MMM yyyy')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{agent.email}</p>
                        <p className="text-muted-foreground">{agent.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <VehicleIcon className="h-4 w-4" />
                        <div>
                          <p className="capitalize">{agent.vehicleType}</p>
                          {agent.vehiclePlate && (
                            <p className="text-xs text-muted-foreground">{agent.vehiclePlate}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{agent.zone || '-'}</TableCell>
                    <TableCell>
                      <span className={agent.currentDeliveries >= agent.maxDeliveries ? 'text-red-600' : ''}>
                        {agent.currentDeliveries} / {agent.maxDeliveries}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={agent.isAvailable ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => {
                          toggleAvailability(agent.id);
                          toast.success(`Agent marked as ${agent.isAvailable ? 'unavailable' : 'available'}`);
                        }}
                      >
                        {agent.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(agent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteAgent(agent.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredAgents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No agents found
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Delivery Agent</DialogTitle>
          </DialogHeader>
          <AgentFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAgent}>Create Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <AgentFormFields />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAgent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAgents;
