function joinClassList(...args): string | undefined {
  const classList = args.filter(Boolean);

  return classList.length > 0 ? classList.join(" ") : undefined;
}

export {joinClassList};
