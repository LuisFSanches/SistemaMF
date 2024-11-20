import styled from "styled-components";

export const Container = styled.div`
	h1, h2, strong, p {
		color: var(--text-body);
	}

	h1 {
		text-align: center;
		margin-bottom: 8px;
		font-size: 30px;
	}

	h2 {
		font-size: 20px;
		padding-bottom: 5px;
	}

	p {
		padding: 4px 0;
		font-size: 18px;
	}
`

export const OrderInfo = styled.div`
	padding: 12px 0px;
`