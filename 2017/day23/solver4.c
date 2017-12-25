#include "stdio.h"

int main() {
  int a = 1;
  int b = 108400;
  int c = b + 17000;
  int d = 0;
  int e = 0;
  int f = 0;
  int g = 0;
  int h = 0;

  printf("Starting\n");

  do {
    f = 1;
    d = 2;
    do {
      e = 2;
      do {
        g = d;
        g *= e;
        g -= b;
        if (!g) {
          f = 0;
        }
        e += 1;
        g = e;
        g -= b;
      } while (g);
      d += 1;
      g = d;
      g -= b;
    } while (g);
    if (!f) {
      h++;
      // console.log('h', h)
      printf("h: %d\n", h);
    }
    g = b;
    g -= c;
    b += 17;
  } while (g);

  printf("Done h: %d\n", h);
  return h;
}
