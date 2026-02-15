const VIEW_MODES = {
  bones: { bones: true, muscle: false },
  muscle: { bones: false, muscle: true },
  both: { bones: true, muscle: true },
};

export function setupViewModeController({ bonesGroup, muscleGroup }) {
  const buttons = [...document.querySelectorAll('button[data-view]')];

  const applyMode = (mode) => {
    const state = VIEW_MODES[mode] ?? VIEW_MODES.both;
    bonesGroup.visible = state.bones;
    muscleGroup.visible = state.muscle;

    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === mode);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => applyMode(button.dataset.view));
  });

  applyMode('both');

  return {
    applyMode,
  };
}
