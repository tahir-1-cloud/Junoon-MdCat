import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/admin/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/admin/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/admin/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/admin/ecommerce/StatisticsChart";
import RecentOrders from "@/components/admin/ecommerce/RecentOrders";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import WelcomeStudentMetaCard from "@/components/user-profile/WelcomeStudentMetaCard";

export const metadata: Metadata = {
    title:
        "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function StudentDashboard() {
    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Welcome Back
                </h3>
                <div className="space-y-6">
                    <WelcomeStudentMetaCard />
                </div>
            </div>
        </div>
    );
}
