import { useNavigate } from "@tanstack/react-router";

export function useSelectTemplateRedirect() {
	const navigate = useNavigate();

	const redirect = (templateId?: string) => {
		navigate({ to: `/create/${templateId}` });
	};

	return { redirect };
}
