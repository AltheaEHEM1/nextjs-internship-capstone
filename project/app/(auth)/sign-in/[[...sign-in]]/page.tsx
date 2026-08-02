// TODO: Task 2.3 - Create sign-in and sign-up pages

import { SignIn } from "@clerk/nextjs";
import BaseAuth from "@/components/layout/BaseAuth";

export default function SignInPage() {
	return (
		<BaseAuth>
			<SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
		</BaseAuth>
	);
}

/*
TODO: Task 2.3 Implementation Notes:
- Import SignIn from @clerk/nextjs
- Configure sign-in redirects
- Style to match design system
- Add proper error handling
*/
