"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const countries = ["Bangladesh", "USA", "Canada", "UK"];
const categories = ["Fashion", "Electronics", "Food", "Books", "Any"];
const currencies = ["BDT", "USD", "CAD", "GBP"];

export default function CreateStore() {
  const [form, setForm] = useState({
    name: "",
    domain: "",
    country: "",
    category: "",
    currency: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [checkingDomain, setCheckingDomain] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "domain") {
      setDomainAvailable(null);
      setErrors((prev) => ({ ...prev, domain: "" }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      newErrors.name = "Store name is required";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Store name must be at least 3 characters long";
    }

    if (!form.domain.trim()) {
      newErrors.domain = "Domain is required";
    } else if (!/^[a-z0-9]+$/i.test(form.domain)) {
      newErrors.domain = "Domain must contain only letters and numbers";
    }

    if (!form.country) newErrors.country = "Country is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.currency) newErrors.currency = "Currency is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email must be in a valid format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkDomain = useCallback(async () => {
    if (!form.domain) return;
    setCheckingDomain(true);
    try {
      const res = await axios.get<{ taken: boolean }>(
        `https://interview-task-green.vercel.app/task/domains/check/${form.domain}.expressitbd.com`
      );
      setDomainAvailable(!res.data.taken);
      setErrors((prev) => ({
        ...prev,
        domain: res.data.taken ? "Domain is already taken" : "",
      }));
    } catch {
      setErrors((prev) => ({ ...prev, domain: "Error checking domain" }));
      setDomainAvailable(null);
    } finally {
      setCheckingDomain(false);
    }
  }, [form.domain]);

  useEffect(() => {
    if (!form.domain) return;

    const delayDebounce = setTimeout(() => {
      checkDomain();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [form.domain, checkDomain]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const checkRes = await axios.get<{ taken: boolean }>(
        `https://interview-task-green.vercel.app/task/domains/check/${form.domain}.expressitbd.com`
      );

      if (checkRes.data.taken) {
        setDomainAvailable(false);
        setErrors((prev) => ({ ...prev, domain: "Domain is already taken" }));
        return;
      }

      setDomainAvailable(true);
      setErrors((prev) => ({ ...prev, domain: "" }));

      router.push("/product");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data || err.message);
      } else {
        console.error("Unknown error:", err);
      }
      alert("Failed to create store. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create Your Online Store
      </h1>
      <form onSubmit={handleSubmit} noValidate>
        {/* Store Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            Store Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Domain */}
        <div className="mb-4">
          <label htmlFor="domain" className="block font-semibold mb-1">
            Subdomain
          </label>
          <input
            type="text"
            id="domain"
            name="domain"
            value={form.domain}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.domain
                ? "border-red-500"
                : domainAvailable
                ? "border-green-500"
                : "border-gray-300"
            }`}
            required
          />
          {checkingDomain && (
            <p className="text-blue-500 text-sm">Checking domain availability...</p>
          )}
          {errors.domain && (
            <p className="text-red-500 text-sm mt-1">{errors.domain}</p>
          )}
          {domainAvailable && !errors.domain && (
            <p className="text-green-600 text-sm mt-1">Domain is available!</p>
          )}
        </div>

        {/* Country */}
        <div className="mb-4">
          <label htmlFor="country" className="block font-semibold mb-1">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block font-semibold mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Currency */}
        <div className="mb-4">
          <label htmlFor="currency" className="block font-semibold mb-1">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.currency ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select currency</option>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Create Store
        </button>
      </form>
    </div>
  );
}
