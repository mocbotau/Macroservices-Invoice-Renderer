import { middleware } from "@src/middleware";
import { NextRequest } from "next/server";

const VALID_SESSION = {
  email: "valid@email.com",
};

const mockGetIronSession = jest.fn();

jest.mock("iron-session/edge", () => {
  return {
    getIronSession: async () => mockGetIronSession(),
  };
});

jest.mock("next/server", () => {
  return {
    __esModule: true,
    NextResponse: {
      next: () => ({ url: "unchanged" }),
      redirect: (x: any) => ({ url: x.pathname }),
    },
  };
});

beforeEach(() => {
  mockGetIronSession.mockReset();
});

describe("Middleware test (/)", () => {
  test("/ redirects to /login (if not signed in)", async () => {
    mockGetIronSession.mockReturnValue({ user: undefined });
    const x = await middleware({
      nextUrl: {
        pathname: "/",
      },
      url: "http://localhost/",
    } as NextRequest);
    expect(x.url).toEqual("/login");
  });

  test("/ redirects to /editor (if signed in)", async () => {
    mockGetIronSession.mockReturnValue({ user: VALID_SESSION });
    const x = await middleware({
      nextUrl: {
        pathname: "/",
      },
      url: "http://localhost/",
    } as NextRequest);
    expect(x.url).toEqual("/editor");
  });
});

describe("Middleware test (/editor)", () => {
  test("/editor redirects to /login (if not signed in)", async () => {
    mockGetIronSession.mockReturnValue({ user: undefined });
    const x = await middleware({
      nextUrl: {
        pathname: "/editor",
      },
      url: "http://localhost/",
    } as NextRequest);
    expect(x.url).toEqual("/login");
  });

  test("/editor doesn't redirect (if signed in)", async () => {
    mockGetIronSession.mockReturnValue({ user: VALID_SESSION });
    const x = await middleware({
      nextUrl: {
        pathname: "/editor",
      },
      url: "http://localhost/",
    } as NextRequest);
    expect(x.url).toEqual("unchanged");
  });
});
