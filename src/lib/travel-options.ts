// lib/travel-options.ts
import { Users, User, Heart, Briefcase, DollarSign, Wallet, CreditCard } from "lucide-react";

export const SelectTravelList = [
  { id: 1, title: "Solo", people: "1 person", icon: User },
  { id: 2, title: "Couple", people: "2 people", icon: Heart },
  { id: 3, title: "Family", people: "3-5 people", icon: Users },
  { id: 4, title: "Business", people: "Team / Group", icon: Briefcase },
];

export const SelectBudgetOptions = [
  { id: 1, title: "Budget", description: "Backpacker style, hostels & local food", icon: DollarSign },
  { id: 2, title: "Moderate", description: "Comfortable hotels & experiences", icon: Wallet },
  { id: 3, title: "Luxury", description: "5-star hotels, fine dining, premium tours", icon: CreditCard },
];
