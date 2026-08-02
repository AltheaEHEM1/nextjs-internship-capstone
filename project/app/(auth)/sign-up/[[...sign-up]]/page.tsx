// TODO: Task 2.3 - Create sign-in and sign-up pages

import { SignUp } from "@clerk/nextjs";
import BaseAuth from "@/components/layout/BaseAuth";

export default function SignUpPage() {
	return (
		<BaseAuth>
			<SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
		</BaseAuth>
	);
}

/*
TODO: Task 2.3 Implementation Notes:
- Import SignUp from @clerk/nextjs
- Configure sign-up redirects
- Style to match design system
- Add proper error handling
- Set up webhook for user data sync (Task 2.5)
*/
