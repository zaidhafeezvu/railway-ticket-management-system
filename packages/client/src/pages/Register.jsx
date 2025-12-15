import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, Globe } from 'lucide-react';
import { z } from 'zod';
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js/min';
import ReactCountryFlag from 'react-country-flag';

// Define the validation schema using Zod
// Supported country codes and simple validation patterns
const COUNTRY_OPTIONS = [
  { code: '+1', label: 'United States (+1)', region: 'US' },
  { code: '+91', label: 'India (+91)', region: 'IN' },
  { code: '+92', label: 'Pakistan (+92)', region: 'PK' },
  { code: '+970', label: 'Palestine (+970)', region: 'PS' },
  { code: '+44', label: 'United Kingdom (+44)', region: 'GB' },
];

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  countryCode: z.enum(['+1', '+91', '+92', '+970', '+44'], {
    message: 'Select a valid country',
  }),
  phone: z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .refine((val, ctx) => {
      const opt = COUNTRY_OPTIONS.find((c) => c.code === ctx.parent.countryCode);
      if (!opt) return false;
      const digitsOnly = val.replace(/\D/g, '');
      return isValidPhoneNumber(digitsOnly, opt.region);
    }, 'Invalid phone number for selected country'),
});

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    countryCode: '+1',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryDropdownRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data (non-throwing)
      const result = registerSchema.safeParse(formData);
      if (!result.success) {
        const firstIssue = result.error.issues?.[0];
        setError(firstIssue?.message || 'Validation failed');
        return;
      }

      const selected = COUNTRY_OPTIONS.find((c) => c.code === formData.countryCode);
      let fullPhone = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`;
      if (selected) {
        const parsed = parsePhoneNumberFromString(formData.phone, selected.region);
        if (parsed && parsed.isValid()) {
          fullPhone = parsed.number; // E.164 format with leading +
        }
      }
      await register(formData.name, formData.email, formData.password, fullPhone);
      navigate('/search');
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic phone placeholder based on selected country code
  const getPhonePlaceholder = (code) => {
    switch (code) {
      case '+1':
        return 'e.g., 4155550123';
      case '+91':
        return 'e.g., 9876543210';
      case '+92':
        return 'e.g., 3012345678';
      case '+970':
        return 'e.g., 599123456';
      case '+44':
        return 'e.g., 7123456789';
      default:
        return 'Enter phone number';
    }
  };

  const selectedCountry = COUNTRY_OPTIONS.find((c) => c.code === formData.countryCode);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!countryDropdownRef.current) return;
      if (!countryDropdownRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Jane Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., jane.doe@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="relative col-span-1" ref={countryDropdownRef}>
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isCountryOpen}
                    onClick={() => setIsCountryOpen((v) => !v)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center gap-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {selectedCountry ? (
                      <ReactCountryFlag
                        svg
                        countryCode={selectedCountry.region}
                        title={selectedCountry.region}
                        style={{ width: '20px', height: '20px' }}
                      />
                    ) : (
                      <Globe className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="truncate">{selectedCountry ? selectedCountry.label : 'Select country'}</span>
                  </button>
                  {isCountryOpen && (
                    <ul
                      role="listbox"
                      className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow"
                    >
                      {COUNTRY_OPTIONS.map((opt) => (
                        <li
                          key={opt.code}
                          role="option"
                          aria-selected={formData.countryCode === opt.code}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, countryCode: opt.code }));
                            setIsCountryOpen(false);
                          }}
                          className={`px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-50 ${formData.countryCode === opt.code ? 'bg-gray-100' : ''}`}
                        >
                          <ReactCountryFlag svg countryCode={opt.region} title={opt.region} style={{ width: '18px', height: '18px' }} />
                          <span className="truncate">{opt.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative col-span-2">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={getPhonePlaceholder(formData.countryCode)}
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
