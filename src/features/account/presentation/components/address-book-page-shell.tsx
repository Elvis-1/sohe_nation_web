"use client";

import Link from "next/link";
import { useState } from "react";

import {
  createCustomerAddress,
  deleteCustomerAddress,
  formatAddressLine,
  setDefaultCustomerAddress,
  updateCustomerAddress,
  type CustomerAddress,
  type CustomerAddressInput,
} from "../../data/services/account-addresses";
import type { AccountApiAuth } from "../../data/services/get-customer-account";

type Props = {
  addresses: CustomerAddress[];
  auth?: AccountApiAuth;
};

const emptyForm: CustomerAddressInput = {
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "NG",
  isDefault: false,
};

export function AddressBookPageShell({ addresses: initialAddresses, auth }: Props) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [form, setForm] = useState<CustomerAddressInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function updateList(next: CustomerAddress) {
    setAddresses((current) => {
      const withoutCurrent = current.filter((address) => address.id !== next.id);
      if (next.isDefault) {
        return [next, ...withoutCurrent.map((address) => ({ ...address, isDefault: false }))];
      }
      return [...withoutCurrent, next].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      if (editingId) {
        const updated = await updateCustomerAddress(editingId, form, auth);
        updateList(updated);
        setMessage("Address updated.");
      } else {
        const created = await createCustomerAddress(form, auth);
        setAddresses((current) => {
          if (created.isDefault) {
            return [created, ...current.map((address) => ({ ...address, isDefault: false }))];
          }
          return [...current, created];
        });
        setMessage("Address added.");
      }
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save address right now.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSetDefault(addressId: string) {
    setMessage(null);
    try {
      const updated = await setDefaultCustomerAddress(addressId, auth);
      updateList(updated);
      setMessage("Default address updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update default address.");
    }
  }

  async function handleDelete(addressId: string) {
    setMessage(null);
    try {
      await deleteCustomerAddress(addressId, auth);
      setAddresses((current) => current.filter((address) => address.id !== addressId));
      setMessage("Address removed.");
      if (editingId === addressId) resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete address.");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <div className="relative z-10">
          <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Address Book
          </div>
          <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
            Keep delivery details
            <span className="block text-[var(--color-accent-gold-highlight)]">ready for checkout.</span>
          </h2>
        </div>

        <div className="relative z-10 mt-8 space-y-3">
          {addresses.length === 0 ? (
            <p className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-4 text-sm text-[var(--color-text-secondary)]">
              No saved addresses yet.
            </p>
          ) : (
            addresses.map((address) => (
              <article key={address.id} className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-[family:var(--font-heading)] text-2xl uppercase leading-none text-[var(--color-text-primary)]">
                    {address.label || "Address"}
                  </p>
                  {address.isDefault ? (
                    <span className="rounded-full border border-[var(--color-border-strong)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-gold-highlight)]">
                      Default
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{address.recipientName}</p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{formatAddressLine(address)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!address.isDefault ? (
                    <button
                      type="button"
                      onClick={() => void handleSetDefault(address.id)}
                      className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                    >
                      Set Default
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(address.id);
                      setForm({
                        label: address.label,
                        recipientName: address.recipientName,
                        phone: address.phone,
                        line1: address.line1,
                        line2: address.line2,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        countryCode: address.countryCode,
                        isDefault: address.isDefault,
                      });
                    }}
                    className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(address.id)}
                    className="rounded-full border border-[#6e3a32] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[#ffb6aa] transition hover:border-[#a64f43]"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
          {editingId ? "Edit Address" : "Add Address"}
        </p>
        <form className="mt-5 grid gap-3" onSubmit={(event) => void handleSubmit(event)}>
          <input value={form.label} onChange={(event) => setForm((c) => ({ ...c, label: event.target.value }))} placeholder="Label (Home, Office)" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          <input value={form.recipientName} onChange={(event) => setForm((c) => ({ ...c, recipientName: event.target.value }))} required placeholder="Recipient name" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          <input value={form.phone} onChange={(event) => setForm((c) => ({ ...c, phone: event.target.value }))} placeholder="Phone (optional)" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          <input value={form.line1} onChange={(event) => setForm((c) => ({ ...c, line1: event.target.value }))} required placeholder="Address line 1" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          <input value={form.line2} onChange={(event) => setForm((c) => ({ ...c, line2: event.target.value }))} placeholder="Address line 2 (optional)" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.city} onChange={(event) => setForm((c) => ({ ...c, city: event.target.value }))} required placeholder="City" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
            <input value={form.state} onChange={(event) => setForm((c) => ({ ...c, state: event.target.value }))} required placeholder="State / Province" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <select value={form.countryCode} onChange={(event) => setForm((c) => ({ ...c, countryCode: event.target.value as CustomerAddressInput["countryCode"] }))} className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]">
              <option value="NG">Nigeria</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="EU">European Union</option>
            </select>
            <input value={form.postalCode} onChange={(event) => setForm((c) => ({ ...c, postalCode: event.target.value }))} placeholder="Postal code" className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]" />
          </div>
          <label className="mt-1 inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <input type="checkbox" checked={Boolean(form.isDefault)} onChange={(event) => setForm((c) => ({ ...c, isDefault: event.target.checked }))} />
            Make default shipping address
          </label>
          {message ? <p className="text-sm text-[var(--color-text-secondary)]">{message}</p> : null}
          <div className="mt-2 flex flex-wrap gap-3">
            <button type="submit" disabled={submitting} className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-60">
              {submitting ? "Saving..." : editingId ? "Update Address" : "Save Address"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
              >
                Cancel edit
              </button>
            ) : null}
            <Link
              href="/account"
              className="rounded-full border border-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Back to account
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
