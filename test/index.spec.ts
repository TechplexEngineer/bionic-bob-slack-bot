import worker from "@/index";

test("should say hello", async () => {
    const env = getMiniflareBindings();
    const res = await worker.fetch(new Request("http://localhost"), env, null);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("Hello, I'm Bionic Bob");
});

