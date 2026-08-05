import { usePathname } from "next/navigation";

const adminPaths = ["/dashboard", "/projects", "/team", "/notification"];
const authPaths = ["/sign-in", "/sign-up"];

export function useLayoutWrapper() {
	const pathname = usePathname();

	const isAdminPath = adminPaths.some((path) => pathname?.startsWith(path));
	const isAuthPath = authPaths.some((path) => pathname?.startsWith(path));

	const disableAdminPadding =
		!!pathname &&
		pathname.startsWith("/projects/") &&
		pathname !== "/projects" &&
		!pathname.startsWith("/projects/project-settings");

	return {
		isAdminPath,
		isAuthPath,
		disableAdminPadding,
	};
}
