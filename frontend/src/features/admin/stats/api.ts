import { apiClient } from "@/lib/api-client";
import { AdminStatsResponse } from "./types";

export async function getAdminStats(): Promise<AdminStatsResponse> {
	const { data } = await apiClient.get<AdminStatsResponse>("/admin/stats");
	return data;
}
