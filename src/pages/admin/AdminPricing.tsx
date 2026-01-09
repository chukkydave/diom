import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Package,
  MapPin,
  Truck,
  Copy,
  Send,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceType } from '@/types/admin';

interface QuoteData {
  serviceType: ServiceType;
  pickupLocation: string;
  deliveryLocation: string;
  packageWeight: string;
  packageDimensions: string;
  packageDescription: string;
  estimatedValue: string;
  specialHandling: string[];
}

interface QuoteResult {
  baseRate: number;
  weightCharge: number;
  distanceCharge: number;
  specialHandlingCharge: number;
  total: number;
  estimatedDelivery: string;
  notes: string;
}

const serviceRates: Record<ServiceType, { base: number; perKg: number; description: string }> = {
  same_day: { base: 3000, perKg: 500, description: 'Delivery within hours' },
  express: { base: 2000, perKg: 300, description: '1-2 business days' },
  standard: { base: 1000, perKg: 150, description: '3-5 business days' },
  international: { base: 15000, perKg: 2000, description: '7-14 business days' },
  freight: { base: 25000, perKg: 100, description: 'Large cargo, custom timeline' },
};

const specialHandlingOptions = [
  { id: 'fragile', label: 'Fragile', charge: 500 },
  { id: 'perishable', label: 'Perishable', charge: 1000 },
  { id: 'hazardous', label: 'Hazardous', charge: 2000 },
  { id: 'oversized', label: 'Oversized', charge: 1500 },
  { id: 'insurance', label: 'Insurance', charge: 0 }, // Percentage based
];

const AdminPricing = () => {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    serviceType: 'standard',
    pickupLocation: '',
    deliveryLocation: '',
    packageWeight: '',
    packageDimensions: '',
    packageDescription: '',
    estimatedValue: '',
    specialHandling: [],
  });

  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [partnerNotes, setPartnerNotes] = useState('');

  const calculateQuote = () => {
    const rate = serviceRates[quoteData.serviceType];
    const weight = parseFloat(quoteData.packageWeight) || 0;
    const value = parseFloat(quoteData.estimatedValue) || 0;

    // Base calculations
    const baseRate = rate.base;
    const weightCharge = weight * rate.perKg;

    // Simulated distance charge (in production, use actual distance API)
    const distanceCharge = quoteData.pickupLocation && quoteData.deliveryLocation ? 500 : 0;

    // Special handling charges
    let specialHandlingCharge = 0;
    quoteData.specialHandling.forEach(handling => {
      const option = specialHandlingOptions.find(o => o.id === handling);
      if (option) {
        if (handling === 'insurance') {
          // 2% of declared value
          specialHandlingCharge += value * 0.02;
        } else {
          specialHandlingCharge += option.charge;
        }
      }
    });

    const total = baseRate + weightCharge + distanceCharge + specialHandlingCharge;

    setQuoteResult({
      baseRate,
      weightCharge,
      distanceCharge,
      specialHandlingCharge,
      total,
      estimatedDelivery: rate.description,
      notes: partnerNotes,
    });

    toast.success('Quote calculated successfully');
  };

  const toggleSpecialHandling = (id: string) => {
    setQuoteData(prev => ({
      ...prev,
      specialHandling: prev.specialHandling.includes(id)
        ? prev.specialHandling.filter(h => h !== id)
        : [...prev.specialHandling, id],
    }));
  };

  const copyQuoteToClipboard = () => {
    if (!quoteResult) return;

    const quoteText = `
DIOM Logistics - Quotation

Service Type: ${quoteData.serviceType.replace('_', ' ').toUpperCase()}
Pickup: ${quoteData.pickupLocation}
Delivery: ${quoteData.deliveryLocation}
Package: ${quoteData.packageDescription}
Weight: ${quoteData.packageWeight} kg

Breakdown:
- Base Rate: ₦${quoteResult.baseRate.toLocaleString()}
- Weight Charge: ₦${quoteResult.weightCharge.toLocaleString()}
- Distance Charge: ₦${quoteResult.distanceCharge.toLocaleString()}
- Special Handling: ₦${quoteResult.specialHandlingCharge.toLocaleString()}

TOTAL: ₦${quoteResult.total.toLocaleString()}

Estimated Delivery: ${quoteResult.estimatedDelivery}

${quoteResult.notes ? `Notes: ${quoteResult.notes}` : ''}

This is an estimate. Final price may vary based on actual measurements and partner rates.
Contact us to confirm your booking.
    `.trim();

    navigator.clipboard.writeText(quoteText);
    toast.success('Quote copied to clipboard');
  };

  const resetForm = () => {
    setQuoteData({
      serviceType: 'standard',
      pickupLocation: '',
      deliveryLocation: '',
      packageWeight: '',
      packageDimensions: '',
      packageDescription: '',
      estimatedValue: '',
      specialHandling: [],
    });
    setQuoteResult(null);
    setPartnerNotes('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl  font-bold">Pricing Calculator</h1>
          <p className="text-muted-foreground">
            Calculate quotes for customer shipments. Adjust based on partner rates before sending.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Quote Calculator
              </CardTitle>
              <CardDescription>
                Enter shipment details to generate an estimate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Service Type */}
              <div>
                <Label>Service Type</Label>
                <Select
                  value={quoteData.serviceType}
                  onValueChange={(value: ServiceType) =>
                    setQuoteData({ ...quoteData, serviceType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(serviceRates).map(([type, rate]) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex justify-between items-center w-full">
                          <span className="capitalize">{type.replace('_', ' ')}</span>
                          <span className="text-muted-foreground ml-2">
                            ₦{rate.base.toLocaleString()} base
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {serviceRates[quoteData.serviceType].description}
                </p>
              </div>

              {/* Locations */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Pickup Location
                  </Label>
                  <Input
                    value={quoteData.pickupLocation}
                    onChange={(e) => setQuoteData({ ...quoteData, pickupLocation: e.target.value })}
                    placeholder="Lagos Island"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Delivery Location
                  </Label>
                  <Input
                    value={quoteData.deliveryLocation}
                    onChange={(e) => setQuoteData({ ...quoteData, deliveryLocation: e.target.value })}
                    placeholder="Ikeja"
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1">
                    <Package className="h-3 w-3" /> Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    value={quoteData.packageWeight}
                    onChange={(e) => setQuoteData({ ...quoteData, packageWeight: e.target.value })}
                    placeholder="5"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label>Dimensions (L×W×H cm)</Label>
                  <Input
                    value={quoteData.packageDimensions}
                    onChange={(e) => setQuoteData({ ...quoteData, packageDimensions: e.target.value })}
                    placeholder="30×20×15"
                  />
                </div>
              </div>

              <div>
                <Label>Package Description</Label>
                <Input
                  value={quoteData.packageDescription}
                  onChange={(e) => setQuoteData({ ...quoteData, packageDescription: e.target.value })}
                  placeholder="Electronics, documents, etc."
                />
              </div>

              <div>
                <Label>Declared Value (₦) - For Insurance</Label>
                <Input
                  type="number"
                  value={quoteData.estimatedValue}
                  onChange={(e) => setQuoteData({ ...quoteData, estimatedValue: e.target.value })}
                  placeholder="50000"
                  min="0"
                />
              </div>

              {/* Special Handling */}
              <div>
                <Label>Special Handling</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialHandlingOptions.map((option) => (
                    <Badge
                      key={option.id}
                      variant={quoteData.specialHandling.includes(option.id) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleSpecialHandling(option.id)}
                    >
                      {option.label}
                      {option.charge > 0 && ` (+₦${option.charge.toLocaleString()})`}
                      {option.id === 'insurance' && ' (2%)'}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Partner Notes */}
              <div>
                <Label>Internal Notes (for partner rate adjustments)</Label>
                <Textarea
                  value={partnerNotes}
                  onChange={(e) => setPartnerNotes(e.target.value)}
                  placeholder="Add notes about partner rates, special considerations..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateQuote} className="flex-1">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Quote
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quote Result */}
          <div className="space-y-6">
            {quoteResult ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quote Summary</span>
                    <Badge variant="outline">
                      {quoteData.serviceType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Rate</span>
                      <span>₦{quoteResult.baseRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Weight Charge ({quoteData.packageWeight || 0} kg)
                      </span>
                      <span>₦{quoteResult.weightCharge.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distance Charge</span>
                      <span>₦{quoteResult.distanceCharge.toLocaleString()}</span>
                    </div>
                    {quoteResult.specialHandlingCharge > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Special Handling</span>
                        <span>₦{quoteResult.specialHandlingCharge.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Estimate</span>
                        <span>₦{quoteResult.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">Estimated Delivery</span>
                    </div>
                    <p className="text-muted-foreground">{quoteResult.estimatedDelivery}</p>
                  </div>

                  {partnerNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Internal Notes</span>
                      </div>
                      <p className="text-yellow-700">{partnerNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={copyQuoteToClipboard} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Quote
                    </Button>
                    <Button className="flex-1" onClick={() => toast.info('Email/WhatsApp integration coming soon')}>
                      <Send className="h-4 w-4 mr-2" />
                      Send to Customer
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    This is an estimate. Adjust based on partner rates before sending to customer.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter shipment details and click "Calculate Quote" to see the estimate</p>
                </CardContent>
              </Card>
            )}

            {/* Rate Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rate Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {Object.entries(serviceRates).map(([type, rate]) => (
                    <div key={type} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                        <p className="text-xs text-muted-foreground">{rate.description}</p>
                      </div>
                      <div className="text-right">
                        <p>₦{rate.base.toLocaleString()} base</p>
                        <p className="text-xs text-muted-foreground">+₦{rate.perKg}/kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
