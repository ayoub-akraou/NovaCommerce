import { getAdminStats } from "./api";

export async function getAdminStatsUseCase() {
	return getAdminStats();
}
